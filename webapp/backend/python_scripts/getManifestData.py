import json
import mechanicalsoup
import sys
import time

def main():

    SITE_NUM = 0 #int(sys.argv[2])
    URL_PARAM = "http://google.com?" #sys.argv[1]
    
    
    if SITE_NUM == 0:
        link = URL_PARAM
        SITE_ID = 0

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
                        # detailDict[detailTitle] = detail
                    if detailTitle == "Price":
                        detail = detail.strip("$")
                        # detailDict[detailTitle] = detail
                    # if detailTitle == "Product":
                    #     detailDict[detailTitle] = detail
                    detailDict[detailTitle] = detail
                    
                
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