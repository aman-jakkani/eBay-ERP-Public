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

import time
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


def main():


    browser = logInSelenium()
    # manifests_list = saveManifests(browser)


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
def logInSelenium():
    loggedIn = False
    while loggedIn == False:
        browser = webdriver.Chrome('./chromedriver')
        browser.get("https://techliquidators.com/tl/index.cfm?action=account_login")

        username_input = '//*[@id="loginUsername"]'
        password_input = '//*[@id="loginPassword"]'
        login_submit = '//*[@id="loginSubmit"]'
        username = input("User Name: ")
        password = getpass.getpass("Password: ")
        # browser.find_element_by_id('loginUsername')
        browser.find_element_by_xpath(username_input)

        print(browser.page_source)
        WebDriverWait(browser,10000).until(EC.visibility_of_element_located((By.username_input)))

        browser.find_element_by_xpath(username_input).send_keys(username)
        break

        browser.find_element_by_xpath(password_input).send_keys(password)
        browser.find_element_by_xpath(login_submit).click()

        browser.get("https://techliquidators.com/index.cfm/p/6")
        soup = BeautifulSoup(browser.page_source, "html.parser")

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


def logInSoup():

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
