import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient

#Mongo Detail
client = MongoClient("mongodb+srv://sai:GNliaHHVYZqdTJu6@cluster0-vo2do.mongodb.net/test?retryWrites=true&ssl_cert_reqs=CERT_NONE")
db = client.movie_database_main
movies_collection = db.movies

def main():
    print("hello world")


main()