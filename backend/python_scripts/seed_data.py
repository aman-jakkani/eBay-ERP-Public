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
db = client.dev_db
client.drop_database("dev_db")

manifests_collection = db.manifests
items_collection = db.items
products_collection = db.products
drafts_collection = db.drafts

def main():
    #logging in to Liquidation Account
    browser = logIn()
    manifests_list = saveManifests(browser)

    saveItems(browser,manifests_list)


    #get and save manifest
    print("Data seeded")

def saveItems(browser, manifests):
    print()
    print("Saving items")
    print()

    ITEM_HEADERS = ["name", "quantity", "price","model","grade"]

    for manifest in manifests:
        auctionId = manifest["auction_id"] 
        #open transcations page
        browser.open("https://www.liquidation.com/aucimg/" + str(auctionId)[0:5]+ "/m"+ str(auctionId) +".html")#14429946
        
        #checking for all formats
        soup = browser.get_current_page().table.table
        if soup == None:
            soup = browser.get_current_page().table

        #storing unique items
        items_dict = {}

        #going through rows of html table
        tr = soup.find_all("tr")

        #Normalising headers from all manifests 
        headers =  [x.get_text() for x in tr[0].find_all('td')]
        for i in range(len(headers)):
            if headers[i] in ["Item Description", "Item Title", "Title","Product"]:
                headers[i] = "name"
            if headers[i] in ["Qty", "Quantity"] :
                headers[i] = "quantity"
            if headers[i] in [ "Retail","Retail Price"]:
                headers[i] = "price"
            if headers[i] == "Model":
                headers[i] = "model"
            if headers[i] in ["Grade"] :
                headers[i] = "grade"

        print("Normalised Headers: ",headers)
            

        for i in range(1,len(tr)-1):
        
            #getting all columns
            td = tr[i].find_all('td')

            #finding id based on site
            id = td[0].get_text()
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
                    "title": None,
                    "condition": None,
                    "condition_desc": None,
                    "price": None,
                    "item_id": item["_id"]}
            draftId = drafts_collection.insert_one(draft).inserted_id

            #ITEM

            items_collection.update_one({"_id":item["_id"]},{"$set": {"draft_id":draft["_id"]}})
            

def saveManifests(browser):

    #open transcations page
    browser.open("https://www.liquidation.com/account/main?tab=Transactions")
    soup = browser.get_current_page()
    transactions_in_progress = soup.find("div",{"class": "flip-scroll"}).table.tbody

    #mongo attributes for manifest collection
    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_price","date_purchased","status"]
    #stores all the manifests
    manifests_list = []
    #geetting table rows
    tr = transactions_in_progress.find_all("tr")
    for i in range(0,4):

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

    loggedIn = False
    while loggedIn == False:
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
           
            if name != "Sign In":
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