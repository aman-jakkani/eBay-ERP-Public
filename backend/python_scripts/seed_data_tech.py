import json
import mechanicalsoup
import sys, os
import time
import pickle

from pymongo import MongoClient

import getpass

from datetime import datetime, timedelta
from bs4 import BeautifulSoup

import time
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select


#Mongo Detail
client = MongoClient("mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/test?retryWrites=true&w=majority")
#Set db
db = client.test_db
# client.drop_database("test_db")

manifests_collection = db.manifests
items_collection = db.items
products_collection = db.products
drafts_collection = db.drafts


def main():

    browser = getBrowser()
    manifests = saveManifests(browser)
    print(manifests)

    saveItems(manifests,browser)


def saveItems(manifests,browser):

    ITEM_HEADERS = ["name", "quantity", "price","model","grade"]

    for manifest in manifests:
        auction_id = manifest["auction_id"]
        auction_url = "https://techliquidators.com/tl/?action=marketplace_main.auction&id=" + str(auction_id)
        browser.get(auction_url)

        #checking for all formats
        soup = BeautifulSoup(browser.page_source, "html.parser").table.table
        if soup == None:
            soup = BeautifulSoup(browser.page_source, "html.parser").table



        #storing unique items
        items_dict = {}

        #going through rows of html table
        tr = soup.find_all("tr")

        #Normalising headers from all manifests
        headers =  [x.get_text().replace("\n","").replace("\t","").lower() for x in tr[0].find_all('th')]

        for i in range(len(headers)):
            if headers[i] in ["item description", "item title", "title","product"]:
                headers[i] = "name"
            if headers[i] in ["qty", "quantity"] :
                headers[i] = "quantity"
            if headers[i] in [ "retail","retail price","estimated msrp","est. msrp"]:
                headers[i] = "price"
            if headers[i] in ["model", "part #"]:
                headers[i] = "model"
            if headers[i] in ["grade"]:
                headers[i] = "grade"

        print("Normalised Headers: ",headers)


        for i in range(1,len(tr)):

            #getting all columns
            td = tr[i].find_all('td')

            #finding id based on site
            id = td[3].get_text()
            #tallying up unique items
            if id not in items_dict.keys():
                #if product is not in dictionary add it
                try:
                    detailDict = {}

                    for i in range(len(td)):

                        value = td[i].get_text().strip()
                        key = headers[i]

                        #filling out detail dictionary
                        if key == "quantity":
                            detail_format = int(value)
                            detailDict[key] = detail_format

                        elif key == "price":
                            detail_format = float(value.strip("$"))
                            detailDict[key] = detail_format

                        else:
                            detailDict[key] = value

                    items_dict[id] = detailDict


                except Exception as ex:
                    print(sys.exc_info())
                    print(  sys.exc_info()[2].tb_lineno)

                    print(ex)
                    print(td)
                    print(manifest)
                    print()

            else:
                #if product exists increase count
                for i in range(len(td)):
                    detail = td[i].get_text()
                    detailTitle = headers[i]

                    if detailTitle == "quantity":
                        detail = int(detail.strip())

                        items_dict[id]['quantity'] += detail
        print(items_dict)
        print()
        
        for key in items_dict:
            #ITEM
            item = items_dict[key]

            #PRODUCT
            product_headers = ["sku","quantity_sold","prices_sold"]
            product_count = products_collection.count_documents({})
            product_count = "{0:0=4}".format(product_count)
            #Creating Unique SKU
            sku = item['name'].split()[1] + str(product_count)
            product = {
                "sku": sku,
                "quantity_sold":0,
                "prices_sold":[]
            }
            productId = products_collection.insert_one(product).inserted_id



            #ITEM
            #add manifestID
            item["manifest_id"] = manifest["_id"]
            item["product_id"] = product["_id"]

            #insert item
            itemId = items_collection.insert_one(item).inserted_id

            print(item)
            print()

            #DRAFT
            draft = {"updated_SKU": False,
                    "published_draft": False,
                    "listed": False,
                    "title": "",
                    "condition": "Used",
                    "condition_desc": "",
                    "price": 0,
                    "item_id": item["_id"]}
            draftId = drafts_collection.insert_one(draft).inserted_id

            #ITEM

            items_collection.update_one({"_id":item["_id"]},{"$set": {"draft_id":draft["_id"]}})



def saveManifests(browser):
    # browser.get("https://techliquidators.com/index.cfm/p/7")
    bidwon = browser.find_element_by_id("no-more-tables")
    html = bidwon.get_attribute('innerHTML')
    soup = BeautifulSoup(html, "html.parser")
    #no-more-tables


    transactions = soup.tbody


    #mongo attributes for manifest collection
    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_price","date_purchased","status","source"]

    manifests_list = []

    tr = transactions.find_all("tr")
    for i in range(0,4):
        value = tr[i].find_all('td')


        def formatValue(value):
            formattedValue = value.get_text().strip().replace("\n","").replace("\t","")
            return formattedValue

        FMT = '%m/%d/%y'
        date = datetime.strptime(formatValue(value[8]).split(" ")[1], FMT)


        #creating dictionary to pass
        manifest = {
          "auction_title" : formatValue(value[1]),
          "auction_id": int(formatValue(value[0])),
          "transaction_id" : int(value[8].form.find("input",{"name":"appSaleID"}).get("value")),
          "quantity" : int(formatValue(value[3])),
          "total_price" : int("".join(filter(str.isdigit, formatValue(value[4]))))/100,
          "date_purchased" : date,
          "status" : formatValue(value[8]).split(" ")[0],
          "source" : "techliquidator.com" }



        # inserting document into collection
        manifests_id = manifests_collection.insert_one(manifest).inserted_id

        manifests_list.append(manifest)




    return manifests_list



def getBrowser():
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
            browser.quit()
            browser = webdriver.Chrome('./chromedriver')

            print("Logging in with method")
            browser = logInSelenium(browser)

            return browser
        else:
            print("Logged in using pickle")
            return browser
    #if anything goes wrong
    except Exception as ex:
        print("Error", ex)
        browser.close()
        browser = webdriver.Chrome('./chromedriver')
        browser = logInSelenium(browser)
        return browser
#Checks if user is signed into website
def checkBrowserLogInStatus(browser):
    browser.get("https://techliquidators.com/index.cfm/p/7")
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

        #User Inputs
        username = input("User Name: ")
        password = getpass.getpass("Password: ")


        #making sure elements are on screen
        WebDriverWait(browser,10).until(EC.visibility_of_element_located((By.XPATH,username_input)))

        #Loading information
        browser.find_element_by_xpath(username_input).send_keys(username)

        browser.find_element_by_xpath(password_input).send_keys(password)

        browser.find_element_by_xpath(remember_me_input).click()

        browser.find_element_by_xpath(login_submit).click()


        loggedIn = checkBrowserLogInStatus(browser)

    #Saving cookies
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
