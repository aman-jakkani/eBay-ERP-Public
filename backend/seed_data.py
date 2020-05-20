import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient
import getpass 
from datetime import datetime, timedelta

#Mongo Detail
client = MongoClient("mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/test?retryWrites=true&w=majority")
#Set db
db = client.test_db
manifests_collection = db.manifests

def main():
    #logging in to Liquidation Account
    browser = logIn()
    #get and save manifest
    getManifests(browser)
    print("Data seeded")

def getManifests(browser):

    #open transcations page
    browser.open("https://www.liquidation.com/account/main?tab=Transactions")
    soup = browser.get_current_page()
    transactions_in_progress = soup.find("div",{"class": "flip-scroll"}).table.tbody

    #mongo attributes for manifest collection
    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_amount","date_purchased","status"]

    #geetting table rows
    tr = transactions_in_progress.find_all("tr")
    for i in range(0,5):

        td = tr[i].find_all('td')
        data_to_add = []

        #formatting data
        for detailCount in range(len(headers)):
            value = td[detailCount].get_text().strip().replace("\n","").replace("\t","")
            data_to_add.append(value)
        #converting time to date time
        FMT = '%Y/%m/%d %H:%M:%S'
        data_to_add[5] = datetime.strptime(data_to_add[5].replace("-","/"), FMT)
        #creating dictionary to pass
        manifest = {
        headers[0] : data_to_add[0],
        headers[1] : int(data_to_add[1]),
        headers[2] : int(data_to_add[2]),
        headers[3] : int(data_to_add[3]),
        headers[4] : int("".join(filter(str.isdigit, data_to_add[4])))/100,
        headers[5] : data_to_add[5],
        headers[6] : data_to_add[6]}
        #inserting document into collection
        manifests_id = manifests_collection.insert_one(manifest).inserted_id

        print(manifest)
        print()

def logIn():
    print("Trying to log in to liquidation")
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