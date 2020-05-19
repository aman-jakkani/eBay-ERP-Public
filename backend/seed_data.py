import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient

#Mongo Detail
client = MongoClient("mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/test?retryWrites=true&w=majority")
db = client.dev_db
manifests_collection = db.manifests

def main():
    #saving manifest
    manifest = {"Name":"Manifest1 Test"}
    manifests_id = manifests_collection.insert_one(manifest).inserted_id

    browser = logIn()


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
    browser["j_password"] = input("Password: ")

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
        return True
    except:
        print("Not Logged In")
        return False

    return(browser)
def stall(sec):
    start = time.time()
    end = time.time()
    while end - start < sec:
        end = time.time()
main()