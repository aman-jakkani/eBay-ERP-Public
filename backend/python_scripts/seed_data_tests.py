import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient
import getpass 
from datetime import datetime, timedelta


def main():

    logIn()

#tech liquidation log in test
def logIn():

    loggedIn = False
    while loggedIn == False:
        print("Trying to log in to liquidation")
        # Connect to Google
        browser = mechanicalsoup.StatefulBrowser()
        browser.open("https://techliquidators.com/tl/index.cfm?action=account_login")
        
        browser.get_current_page()
        # Fill-in the form
        browser.select_form('form[id="login"]')

        # browser.get_current_form().print_summary()
        browser["loginUsername"] = input("User Name: ")
        browser["loginPassword"] = getpass.getpass("Password: ")

        browser.submit_selected()
        #log in check
        browser.open("https://techliquidators.com/index.cfm/p/6")
        soup = browser.get_current_page()
        try:
            name = soup.find("div",{"class" : "col-md-8 text-right"}).small.get_text()
            if name == None:
                print("Not logged in. Try again.")
                
           
            elif "Welcome" in name:
                print(name)
                print("Logged In")
                loggedIn = True
            else:
                print("Not logged in. Try again.")
        
        except:

            print("Not logged in. Try again.")

       

    return(browser)
def stall(sec):
    start = time.time()
    end = time.time()
    while end - start < sec:
        end = time.time()
main()