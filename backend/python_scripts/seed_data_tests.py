import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient
import getpass
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

import pickle
import time
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

def main():

    
    #trying to use previous browser state and log in
    try:
        browser = webdriver.Chrome('./chromedriver')
        browser.get("https://techliquidators.com")

        #adding back cookies
        cookies = pickle.load(open("techLiquidatorCookies.pickle", "rb"))
        for cookie in cookies:
            browser.add_cookie(cookie)
        #checking if cookies are timed out
        print("Checking browser log in status")
        checkBrowserBool = checkBrowserLogInStatus(browser)

        if  checkBrowserBool == False:
            browser.close()
            browser = webdriver.Chrome('./chromedriver')

            print("Logging in with method")
            browser = logInSelenium(browser)
        else:
            print("Logged in using pickle")
    #if anything goes wrong
    except Exception as ex:
        print("Error", ex)
        browser.close()
        browser = webdriver.Chrome('./chromedriver')
        browser = logInSelenium(browser)

        checkBrowserBool = checkBrowserLogInStatus(browser)
        if  checkBrowserBool == False:
            print("check code something went wrong")




def saveManifests(browser):
    browser.get("https://techliquidators.com/index.cfm/p/7")
    stall(2)
    top = browser.find_element_by_id("bidwon")
    b = top.get_attribute('innerHTML')


    print(top)
    print(b)

    # transactions_in_progress = soup.prettify() #.find("div",{"id":{"no-more-tables"}}).table

    # print(transactions_in_progress)

    #mongo attributes for manifest collection
    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_price","date_purchased","status","source"]



    return []

def checkBrowserLogInStatus(browser):
    browser.get("https://techliquidators.com/index.cfm/p/6")
    stall(3)
    soup = BeautifulSoup(browser.page_source, "html.parser")

    try:
        name = soup.find("div",{"class" : "col-md-8 text-right"}).small.get_text()
        if name == None:
            print("Not logged in. Try again.")
            return False
        elif "Welcome" in name:
            print(name)
            print("Logged In")
            return True
        else:
            print("Not logged in. Try again.")
            return False
    except:
        print("Not logged in. Try again.")
        return False

#tech liquidation log in test
def logInSelenium(browser):

    loggedIn = False
    while loggedIn == False:
        browser.get("https://techliquidators.com/tl/index.cfm?action=account_login")

        username_input = '/html/body/div/div/div/div[2]/div[2]/div/div/div/div[2]/form/div[1]/input'
        password_input = '/html/body/div/div/div/div[2]/div[2]/div/div/div/div[2]/form/div[2]/input'
        remember_me_input = '/html/body/div/div/div/div[2]/div[2]/div/div/div/div[2]/form/div[3]/label/input'


        login_submit = '//*[@id="loginSubmit"]'
        username = input("User Name: ")
        password = getpass.getpass("Password: ")
        

        browser.find_element_by_xpath(username_input)

        
        WebDriverWait(browser,10).until(EC.visibility_of_element_located((By.XPATH,username_input)))
        


        browser.find_element_by_xpath(username_input).send_keys(username)

        browser.find_element_by_xpath(password_input).send_keys(password)

        browser.find_element_by_xpath(remember_me_input).click()

        browser.find_element_by_xpath(login_submit).click()


        loggedIn = checkBrowserLogInStatus(browser)

   
    with open("techLiquidatorCookies.pickle","wb") as f:
        pickle.dump(browser.get_cookies(),f)
    

    return(browser)


def stall(sec):
    start = time.time()
    end = time.time()
    while end - start < sec:
        end = time.time()
main()

# def logInSoup():

#     loggedIn = False
#     while loggedIn == False:
#         print("Trying to log in to Tech Liquidators")


#         browser = mechanicalsoup.StatefulBrowser()
#         browser.session.headers.update({ 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})

#         browser.open("https://techliquidators.com/tl/index.cfm?action=account_login")

#         browser.get_current_page()
#         # Fill-in the form
#         browser.select_form('form[id="login"]')

#         # browser.get_current_form().print_summary()
#         browser["loginUsername"] = input("User Name: ")
#         browser["loginPassword"] = getpass.getpass("Password: ")

#         browser.submit_selected()
#         #log in check
#         browser.open("https://techliquidators.com/index.cfm/p/6")
#         soup = browser.get_current_page()
#         try:
#             name = soup.find("div",{"class" : "col-md-8 text-right"}).small.get_text()
#             if name == None:
#                 print("Not logged in. Try again.")


#             elif "Welcome" in name:
#                 print(name)
#                 print("Logged In")
#                 loggedIn = True
#             else:
#                 print("Not logged in. Try again.")

#         except:

#             print("Not logged in. Try again.")



#     return(browser)