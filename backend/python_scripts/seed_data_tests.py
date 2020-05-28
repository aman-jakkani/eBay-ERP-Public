import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient
import getpass
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import requests
from requests_html import HTMLSession


def main():

    session = HTMLSession()
    r = session.get("https://techliquidators.com/index.cfm/p/7")
    # r.html.render()

    browser = logIn()
    manifests_list = saveManifests(browser)


def saveManifests(browser):


    browser.open("https://techliquidators.com/index.cfm/p/7")
    soup = browser.get_current_page()



    transactions_in_progress = soup.prettify() #.find("div",{"id":{"no-more-tables"}}).table

    print(transactions_in_progress)

    #mongo attributes for manifest collection
    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_price","date_purchased","status","source"]

    browser.download_link("https://techliquidators.com/csincludes/_wonAuctions_Query2Excel.cfm?UserID=1987480")


    return []

#tech liquidation log in test
def logIn():

    loggedIn = False
    while loggedIn == False:
        print("Trying to log in to Tech Liquidators")


        browser = mechanicalsoup.StatefulBrowser()
        browser.session.headers.update({ 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})

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
