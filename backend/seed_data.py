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
    #saving manifest
    manifest = {"auction":"auction1","auction_id":"14422849","date_purchased":"2020-05-16 21:05:00"}
  
    manifest_attributes_list = []


    #manifests_id = manifests_collection.insert_one(manifest).inserted_id

    browser = logIn()
    getManifests(browser)

def getManifests(browser):
    browser.open("https://www.liquidation.com/account/main?tab=Transactions")
    soup = browser.get_current_page()
    transactions_in_progress = soup.find("div",id='flip-scroll').find_all('div',recursive=False)
    print(transactions_in_progress)

    

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