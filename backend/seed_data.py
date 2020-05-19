import json
import mechanicalsoup
import sys
import time
from pymongo import MongoClient

#Mongo Detail
client = MongoClient("mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/test?retryWrites=true&w=majority")
db = client.dev_db
manifests_collection = db.manifests

def main():
    #saving manifest
    manifest = {"Name":"Manifest1 Test"}
    manifests_id = manifests_collection.insert_one(manifest).inserted_id


main()