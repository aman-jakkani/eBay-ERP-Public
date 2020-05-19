import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient
import getpass 

#Mongo Detail
client = MongoClient("mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/test?retryWrites=true&w=majority")
db = client.test_db
manifests_collection = db.manifests

def main():

    browser = logIn()
    #get and save manifest
    getManifests(browser)
    print("Data seeded")

def getManifests(browser):
    browser.open("https://www.liquidation.com/account/main?tab=Transactions")
    soup = browser.get_current_page()
    transactions_in_progress = soup.find("div",{"class": "flip-scroll"}).table.tbody
    # print( transactions_in_progress.table.tbody )

    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_amount","date_purchased","status"]
    tr = transactions_in_progress.find_all("tr")
    for i in range(0,5):

        manifest = {}
        td = tr[i].find_all('td')

        for detailCount in range(len(headers)):
            value = td[detailCount].get_text().strip().replace("\n","").replace("\t","")
            key = headers[detailCount]

            manifest[key] = value
        manifests_id = manifests_collection.insert_one(manifest).inserted_id

        print(manifest)
        print()

def logIn():
    print("Trying to log in")
    # Connect to Google
    browser = mechanicalsoup.StatefulBrowser()
    browser.open("https://www.liquidation.com/login")
    
    browser.get_current_page()
    # Fill-in the form
    browser.select_form('form[id="loginForm"]')

    # browser.get_current_form().print_summary()
    browser["j_username"] = input("User Name: ")
    browser["j_password"] = getpass.getpass("Password: ")

    browser.submit_selected()
    #log in check
    browser.open("https://www.liquidation.com/account/main")
    soup = browser.get_current_page()
    try:
        name = soup.find(id='signDetails').span.get_text()
        if name == None:
            return False
        print(name)
        print("Logged In")
       
    except:
        print("Not Logged In")
       

    return(browser)
def stall(sec):
    start = time.time()
    end = time.time()
    while end - start < sec:
        end = time.time()
main()