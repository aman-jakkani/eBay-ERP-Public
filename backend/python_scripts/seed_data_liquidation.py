import sys
sys.path.append('./python_modules/lib/python/site-packages')
import json
import mechanicalsoup
import time
from pymongo import MongoClient
import getpass
from datetime import datetime, timedelta

#Mongo Detail
client = MongoClient("mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/test?retryWrites=true&w=majority")
#Set db
db = client.test_db
client.drop_database("test_db")

manifests_collection = db.manifests
items_collection = db.items
products_collection = db.products
drafts_collection = db.drafts

#Log in credentails from node
username = sys.argv[1]
password = sys.argv[2]
userID = sys.argv[3]

def main():
    #logging in to Liquidation Account
    print("logging in to Liquidation Account")
    browser = logIn()

    if browser != None:
        print("Saving Manifests")

        manifests_list = saveManifests(browser)
        print("Saving Items")
        saveItems(browser,manifests_list)

        #get and save manifest
        print("Data seeded")
    else:
        print("Data failed to be seeded")

def saveItems(browser, manifests):


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
            item["user_id"] = userID

            #insert item
            itemId = items_collection.insert_one(item).inserted_id



            #DRAFT
            draft = {"updated_SKU": False,
                    "published_draft": False,
                    "listed": False,
                    "title": None,
                    "condition": "Used",
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
    transactions_in_progress = soup.find("div",{"id": "content"})

    #mongo attributes for manifest collection
    headers = ["auction_title", "auction_id", "transaction_id","quantity","total_price","date_purchased","status","source","user_id"]
    #stores all the manifests
    manifests_list = []
    #geetting table rows
    tr = transactions_in_progress.find_all("tr")

    #number of manifests to save
    for i in range(12):

        try: 
            td = tr[i].find_all('td')
        except:
            continue
        if len(td) == 0:
            continue

        data_to_add = []

        #formatting data -1 to not incude source and userid
        for detailCount in range(len(headers) - 2):
            value = td[detailCount].get_text().encode("utf-8").strip().replace("\n","").replace("\t","").replace("\xc2\xa0"," ")
            data_to_add.append(value)

        #converting time to date time account for change in format
        
        try:
            FMT = '%Y/%m/%d %H:%M:%S'
            data_to_add[5] = datetime.strptime(data_to_add[5].replace("-","/"), FMT)
        except Exception as ex  :
            # print("Exception occured while converting data",ex)
            try:
                status = data_to_add.pop(3)
                data_to_add.append(status)
                FMT = '%m/%d/%Y'
                data_to_add[5] = datetime.strptime(data_to_add[5].replace("-","/"), FMT)
            except Exception as ex  :
                print("Exception occured while converting data",ex)
                raise Exception("Could not convert text to time")



    
        #creating dictionary to pass
        manifest = {
        headers[0] : data_to_add[0],
        headers[1] : int(data_to_add[1]),
        headers[2] : int(data_to_add[2]),
        headers[3] : int(data_to_add[3]),
        headers[4] : int("".join(filter(str.isdigit, data_to_add[4])))/100,
        headers[5] : data_to_add[5],
        headers[6] : data_to_add[6],
        headers[7] : "liquidation.com",
        headers[8] : userID}

        #inserting document into collection
        manifests_id = manifests_collection.insert_one(manifest).inserted_id


        manifests_list.append(manifest)

    return manifests_list

def logIn():

    loggedIn = False
    print("Trying to log in to liquidation")
    # Connect to Google
    browser = mechanicalsoup.StatefulBrowser()
    browser.open("https://www.liquidation.com/login")

    browser.get_current_page()
    # Fill-in the form
    browser.select_form('form[id="loginForm"]')

    # browser.get_current_form().print_summary()
    browser["j_username"] = username    #input("User Name: ")
    browser["j_password"] = password    #getpass.getpass("Password: ")

    browser.submit_selected()
    #log in check
    browser.open("https://www.liquidation.com/account/main")
    soup = browser.get_current_page()
    try:
        name = soup.find(id='signDetails').span.get_text()
        if name == None:
            sign_in_error()

        elif name != "Sign In":
            print(name)
            print("Logged In")
            loggedIn = True
        else:
            sign_in_error()

    except:

        sign_in_error()


    if loggedIn:
         return(browser)
    else:
        return  None

def sign_in_error():
    print("Failed to sign in")

def stall(sec):
    start = time.time()
    end = time.time()
    while end - start < sec:
        end = time.time()
main()
