import json
import mechanicalsoup
import sys
import time

def main():

   
    link = "https://techliquidators.com/files/pallets_73440129_050620_085647.htm"
    SITE_ID = 3

    #starting browser
    browser = mechanicalsoup.StatefulBrowser()

    #Opening website link
    browser.open(link)

    #checking for all formats
    soup = browser.get_current_page().table.table
    if soup == None:
        soup = browser.get_current_page().table

    #storing unique products
    product_dict = {}

    #going through rows of html table
    tr = soup.find_all("tr")
    #Making it so that headers from all websites are normalised
    headers =  [x.get_text() for x in  tr[0].find_all('td')]
    for i in range(len(headers)):
        if headers[i] == "Qty":
            headers[i] = "Quantity"
        if headers[i] in [ "Retail","Retail Price", "Estimated MSRP"]:
            headers[i] = "Price"
        if headers[i] in ["Item Description", "Item Title", "Title"]:
            headers[i] = "Product"
    for i in range(1,len(tr)-1):
    
        #getting all columns
        td = tr[i].find_all('td')

        #finding id based on site
        id = td[SITE_ID].get_text()
        print(td)
        #tallying up unique products
        if id not in product_dict.keys():
            #if product is not in dictionary add it
            try:
                detailDict = {}
                for detailCount in range(len(td)):
                
                    detail = td[detailCount].get_text()
                    detailTitle = headers[detailCount]
                    if detailTitle == "Quantity":
                        detail = int(detail.strip())
                        detailDict[detailTitle] = detail
                    if detailTitle == "Price":
                        detail = detail.strip("$")
                        detailDict[detailTitle] = detail
                    if detailTitle == "Product":
                        detailDict[detailTitle] = detail
                    # detailDict[detailTitle] = detail
                    
                
                product_dict[id] = detailDict
            except:
                err = "did not work"
        
        else:
            #if product exists increase count
            for detailCount in range(len(td)):
                detail = td[detailCount].get_text()
                detailTitle = headers[detailCount]

                if detailTitle == "Quantity":
                    detail = int(detail.strip())
                
                    product_dict[id]['Quantity'] += detail
            
    # output to server
    # print(json.dumps(product_dict))
    fo = open("foo.json", "w")
    jsonDict = json.dumps(product_dict)
    fo.write(jsonDict)
    fo.close()
    with open('foo.json') as json_data:
	    for entry in json_data:
	        print(entry)
    # for dataDict in :
    #     print(dataDict)
main()



































# sys.stdout.flush()

# with open('countries.json') as json_data:
# 	for entry in json_data:
# 		print("hi bye")


# import mechanicalsoup
# import time
# import pickle
# import sys
# sys.setrecursionlimit(50000)

# def main():
#     # with open("browser.pickle","rb") as f:
#     #     browser = pickle.load(f)
#     #     checkBrowserBool = checkBrowser(browser)
#     #     if  checkBrowserBool == False:
#     #         browser = logIn()

#     browser = logIn()
#     get_listings(browser)
    
# def get_listings(browser):     
#     browser.open("https://www.liquidation.com/auction/search?query=TQ3xL222Tyj49f2ckN2hKN1aeNw.eNwbeNDpkUDaka2V&flag=new")

#     soup = browser.get_current_page()


#     results_listing = soup.find('div',id="results_listing")
#     # stall(8)
#     print([child for child in results_listing.find_all('div',recursive=False)][3])




# def logIn():
#     # Connect to Google
#     browser = mechanicalsoup.StatefulBrowser()
#     browser.open("https://www.liquidation.com/login")
    
#     browser.get_current_page()
#     # Fill-in the form
#     browser.select_form('form[id="loginForm"]')

#     browser.get_current_form().print_summary()
#     browser["j_username"] = "venusunny"
#     browser["j_password"] = "Free1mont"

#     browser.submit_selected()

    


#     # browser.select_form('form[name="Response"]')
#     # browser.submit_selected()



#     # browser.select_form('form[name="getform"]')
#     # browser.submit_selected()
#     #print(browser.get_current_page())
#     # stall(8)
#     with open("browser.pickle","wb") as f:
#         pickle.dump(browser,f)
#     # #browser.open("https://utdirect.utexas.edu/apps/registrar/course_schedule/20182/results/?ccyys=20182&search_type_main=INSTR&instr_last_name=CONLEY&instr_first_initial=&x=40&y=9")
#     return(browser)

# def stall(sec):
#     start = time.time()
#     end = time.time()
#     while end - start < sec:
#         end = time.time()








# main()