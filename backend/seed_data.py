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
product_collection = db.products

def main():
    #logging in to Liquidation Account
    browser = logIn()
    #get and save manifest
    manifests_list = saveManifests(browser)

    saveProducts(browser,manifests_list)


    print("Data seeded")

def saveProducts(browser, manifests):
    print()
    print("Saving products")
    print()

    headers = ["title", "quantity", "price","model","grade"]

    for manifest in manifests:
        auctionId = manifest["auction_id"] 
        #open transcations page
        browser.open("https://www.liquidation.com/aucimg/" + str(auctionId)[0:5]+ "/m"+ str(auctionId) +".html")#14429946
        
        #checking for all formats
        soup = browser.get_current_page().table.table
        if soup == None:
            soup = browser.get_current_page().table

        #storing unique products
        product_dict = {}

        #going through rows of html table
        tr = soup.find_all("tr")


        for i in range(1,len(tr)-1):
        
            #getting all columns
            td = tr[i].find_all('td')

            #finding id based on site
            id = td[0].get_text()
            #tallying up unique products
            if id not in product_dict.keys():
                #if product is not in dictionary add it
                try:
                    data_to_add = []
                    for detailCount in range(len(td)):
                        
                        value = td[detailCount].get_text().strip()
                        data_to_add.append(value)
                        
                    detailDict = {
                        headers[0] : data_to_add[0],
                        headers[1] : int(data_to_add[1]),
                        headers[2] : float(data_to_add[2].strip("$")),
                        headers[3] : data_to_add[4],
                        headers[4] : data_to_add[5]
                    }
                    
                    product_dict[id] = detailDict
                except Exception as ex:
                    print(ex)
            
            else:
                #if product exists increase count
                for i in range(len(td)):
                    detail = td[i].get_text()

                    if i == 1:
                        detail = int(detail.strip())
                    
                        product_dict[id]['quantity'] += detail

        for key in product_dict:

            product = product_dict[key]
            product["manifest_id"] = manifest["_id"]
            productId = product_collection.insert_one(product).inserted_id

            print(product)
            print()

def saveManifests(browser):

    #open transcations page
    browser.open("https://www.liquidation.com/account/main?tab=Transactions")
    soup = browser.get_current_page()
    transactions_in_progress = soup.find("div",{"class": "flip-scroll"}).table.tbody

    #mongo attributes for manifest collection
    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_amount","date_purchased","status"]
    #stores all the manifests
    manifests_list = []
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
        manifests_list.append(manifest)
    return manifests_list

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