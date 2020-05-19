#regular expressions
import re
import mechanicalsoup
import time
import sys
from bs4 import BeautifulSoup
from selenium import webdriver
from pymongo import MongoClient
import datetime
import threading
from selenium.webdriver.common.keys import Keys
import requests
import base64

#Mongo Detail
client = MongoClient("mongodb+srv://sai:GNliaHHVYZqdTJu6@cluster0-vo2do.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE")
db = client.movie_database_main
movies_collection = db.movies

class myThread (threading.Thread):
    def __init__(self, threadID, link, movie_id):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.link = link
        self.movie_id = movie_id

    def run(self):
        # print ("Starting " + str(self.threadID))
        docLink = self.get_movie_link(self.link)
        print ("Exiting " + str(self.threadID))

    def get_movie_link(self,movie_bitly):

        selenium_browser = webdriver.Chrome('./chromedriver')

        print("got link", self.threadID)
        selenium_browser.get(movie_bitly)

        self.stall(7) #stall for add

        #priting the link
        #print("link to video", str(selenium_browser.find_element_by_id("skipper").get_attribute('href')))

        #Don't need to do
        #clicking on skip add
        # try:
        #     print("cliked on skip ad")
        #     selenium_browser.find_element_by_id("skipdiv").click()
        # except Exception as e:
        #     print("could get link", self.threadID, e)
        # # selenium_browser.get('skipper').click()
        

        #Mark:- Skipping Ads
        '''
        #
            try: #trying to close ad 1
                print("trying to close ad v1", self.threadID)
                selenium_browser.switch_to.window(selenium_browser.window_handles[1])
                selenium_browser.close();
                #selenium_browser.find_element_by_tag_name('html').send_keys(Keys.COMMAND + 'w')
                selenium_browser.switch_to.window(selenium_browser.window_handles[0])

            except Exception as e:
                print("no need1", self.threadID , e)

            self.stall(3)

            
            try: #trying to close ad 2
                print("trying to close ad v2", self.threadID)
                selenium_browser.switch_to.window(selenium_browser.window_handles[1])
                selenium_browser.close();
                #selenium_browser.find_element_by_tag_name('html').send_keys(Keys.COMMAND + 'w')
                selenium_browser.switch_to.window(selenium_browser.window_handles[0])

            except Exception as e:
                print("no need2", self.threadID, e)


            self.stall(3)

            try: #trying to close ad 3
                print("trying to close ad v3", self.threadID)
                selenium_browser.switch_to.window(selenium_browser.window_handles[1])
                selenium_browser.close();
                #selenium_browser.find_element_by_tag_name('html').send_keys(Keys.COMMAND + 'w')
                selenium_browser.switch_to.window(selenium_browser.window_handles[0])

            except Exception as e:
                print("no need3", self.threadID, e)


            # print("tried to close tab", self.threadID)
        '''

        #getting doc link
        try:
            print("attempting to get video link", self.threadID)
            while "iframe" in selenium_browser.page_source and (".php" in selenium_browser.find_element_by_tag_name("iframe").get_attribute('src')):
                iframe = selenium_browser.find_element_by_tag_name("iframe")
                #print(iframe.get_attribute('src'), iframe, self.threadID)
                selenium_browser.switch_to.frame(iframe)
        except Exception as e:
            print("fuckkkkkkk", self.threadID, e)

        docLink = selenium_browser.find_element_by_tag_name("iframe").get_attribute('src')
        print("got link succesful Thread: ", self.threadID, docLink )
        selenium_browser.quit()
        self.addToDb(docLink)

    def addToDb(self,link):
        # print("movie link", link)
        try:
            movies_collection.update_one({'_id':self.movie_id}, {"$set": {"Source": link}})
        except:
            print("Falied to update doc with link")

    def stall(self, sec):
        start = time.time()
        end = time.time()
        while end - start < sec:
            # if (end - start) % 1 == 0:
            #     print(end - start)
            end = time.time()

class Webscraper:

    def __init__(self):
        print("Scraper starting")
        self.current_page = "1"
        self.movie =  {}
        self.threads = []

    def scrape_homepage(self):
        # Connect to Google
        self.browser = mechanicalsoup.StatefulBrowser()
        #Going to next page
        self.browser.open("http://topnow.se/index.php?&page="+ self.current_page)
        self.soup = self.browser.get_current_page()

        #finds the table with all the movie listing on the first page
        self.tables  = self.soup.find_all("table", class_="topic_table")

        #finds page numbers
        self.pg_num = self.soup.find("div", class_="mainpagination")
        self.current_page =  str(int(self.pg_num.table.tr.find("b").text) + 1)
        self.last_page = self.pg_num.table.tr.find_all("td")[-1].text

    def get_movie_links(self):
        print("On page", self.current_page)
        self.scrape_homepage()
        max_threads = 4  #maximum Thread Counts
        thread_count = 0 #current Thread Count
        for i in range(len(self.tables)):
            print("    On movie", i)
            try:
                #getting the link of the movie on the page
                self.link = "http://topnow.se/" + (self.tables[i].div.td.a.get('href'))
                print(self.link,"link")
    
                self.browser.open(self.link)
                self.movie_info_page_soup = self.browser.get_current_page()
                
                #saving movie information to self.movie
                self.get_movie_information(self.movie_info_page_soup)

                print("got movie info")

                movie_id = self.addToDb()

                #need to put a try for broken links
                #http://topnow.se/watch/ghost-house
                if movie_id != None:
                    #Mark:- Threading. The database should already have movie information, thread allows to get movie link`
                    try:
                        #getting the link to the bit.ly ad page for the movie
                        self.link_to_ad = self.movie_info_page_soup.find(id="playthevid").get('href')

                        #opening the link to ad and waiting 30 sec and getting doc link
                        #using threads
                        thread = myThread(i,"http://topnow.se/" + self.link_to_ad, movie_id)
                        docLink = thread.start()
                        # print("saving to db")
                        self.threads.append(thread)
                        thread_count += 1

                        if thread_count == max_threads:
                            for thread in self.threads:
                                thread.join()
                            thread_count = 0
                    except:
                        print("http://topnow.se/"+ self.link, "could not be loaded")
            except:
                print("Link did not work")

        

    def get_movie_information(self,movie_soup):
        #For When there are movies within movies
        try:
            movie_div = movie_soup.find(id="nameinfo").find_all('span')
            #Setting Time and Place Holder Source
            self.movie["Date"] =  datetime.datetime.utcnow()
            self.movie["Source"] =  "source"

            movie_information = {}
            #Majority of movie information
            for x in movie_div:
                movie_information[str(x.previous_sibling).strip()[:-1]] = x.text

            self.movie["movie information"] = movie_information



            #Name
            self.movie["Title"] = movie_soup.find(id="nametitle").text
            #Alt Download Links
            self.movie["Alt Links"] = [link.get('href') for link in movie_soup.find(id='1strow').find_all("a")]
            #Image
            imageLink = "http://topnow.se" + movie_soup.find(id="nameimage")['src']
            with open('tempImage.jpg', 'wb') as f:
                f.write(requests.get(imageLink).content)
                f.close()
            image = open('tempImage.jpg','rb')
            encodedStr = base64.b64encode(image.read())

            self.movie["Image"]  = encodedStr

        except:
            self.movie["Title"] = "None"

        # print(self.movie)

    def addToDb(self):
        if self.movie["Title"] != "None":
            movie_id = movies_collection.insert_one(self.movie).inserted_id
            self.movie = {}
            return movie_id
        else:
            movie_id = None
            self.movie = {}
            return movie_id
        

def main():

    webscraper = Webscraper()
    print(webscraper.current_page)
    while  webscraper.current_page != "14":
        webscraper.get_movie_links()

    #to get last page
    # webscraper.get_movie_links()


main()