#!/usr/bin/python
#-------------------------------------------------------------------------------
# Name:		RadioDBTools.py
# Purpose:	To allow easy interfacing (uploading, downloading) with a CouchDB
#			instance.
#
# Author:	  Ben Wise
# Email:	   bwise@smu.edu
#
# Created:	 27/06/2013
# Copyright:   (c) Ben Wise 2013
# Licence:	 GNU General Public License
# Version:	 1.0
#-------------------------------------------------------------------------------
#Imports
import sys
import os
import getpass
import re
import requests
import json
import codecs

#Global Vars
name = "RadioDBTools.py"
MADFversion = "2.01"

#Prints a Help Menu
def help():
    print ("< help > subroutine called:")
    print ("\nWelcome to " + name)
    print ("This script imports .csv files to Material Assay Data Format v." + MADFversion )
    print ("\nUsage: python" + name + "[-u|-d|-h]")
    print ("\n\nOptions:\n")
    print ("-u : Uploads .json files to a couchdb instance of your choice.\n")
    print ("	 Useage: python" + name + "-u.\n")
    print ("-d : Downloads .json files from a couchdb instance of your choice.\n")
    print ("	 Useage: python" + name + "-d.\n")
    print ("-p : Prunes (Deletes) all files of type \"measurement\" from a couchdb instance of your choice.\n")
    print ("	 Useage: python" + name + "-p.\n")

#Calls the different subroutines based on which arguments are passed
def main():
	print ("----------\nWelcome to RadioDBTools.py:\n\nCaveat Emptor:\nPlease double check all documents before uploading and downloading.")
	print ("Caution:\nAny operations done by this script are final and may cause data loss.\n----------\n")
	if len(sys.argv) > 1 :
		if sys.argv[1] == "-h":
			help()
		elif sys.argv[1] == "-u":
			if len(sys.argv)==2:
				upload_json()
			else:
				help()
				print ("\n*******\nERROR:\nIncorrect number of Arguments.\n*******\n")
		elif sys.argv[1] == "-d":
			if len(sys.argv)==2:
				download_json()
			else:
				help()
				print ("\n*******\nERROR:\nIncorrect number of Arguments.\n*******\n")
		elif sys.argv[1] == "-p":
			if len(sys.argv)==2:
				prune_db()
			else:
				help()
				print ("\n*******\nERROR:\nIncorrect number of Arguments.\n*******\n")
		else:
			help()
			print("\n*******\nERROR:\nUnknown or incorrect argument. Could not parse <", sys.argv[1], ">. \nPlease try again.\n*******\n")
	else:
		help()
		print("\n*******\nERROR\nNo argument specified.\nPlease try again.\n*******\n")

def get_uuid(db):
	import requests
	uuid_url = db + "/_uuids"
	uuid = requests.get(uuid_url).text[11:][:-4]
	
	return uuid

def upload_json():
	print("< upload_json > subroutine called:")
	#Ask if the user wants to upload all .json files in directory
	pwd=os.getcwd()
	msg = "Would you like to upload all files in\n" + pwd + "\n(Y/N) ? "
	print( "\nFiles that do not contain valid JSON will not be uploaded\n(and should not cause errors)!\n")
	uploadall=input(msg).lower()
	if uploadall== "y":
		upload_listing = os.listdir()
	else:
		print("\n")
		#If not ask which files the user wants to upload
		upload_listing =[]
		dir_listing = os.listdir()
		for i in dir_listing:
			msg = "Would you like to upload " + i + " (Y/N) ? "
			upload=input(msg).lower()
			if upload== "y":
				upload_listing.append(i)

	print( 
	"""
	Note: If the database is in a local instance of CouchDB
	the URL will most likely be http://localhost:5984 .
	
	Please do not enter username and password here. 
	Remember to enter http:// or similar and please refrain from
	using a trailing forward slash ("/").
	
	Press return to use http://localhost:5984 . 
	""")
	couchdb= input("Please enter the URL of the CouchDB installation: ")
	if len(couchdb) < 3:
		couchdb = "http://localhost:5984"
	db = input ("Please enter the name of the database (No / please) : ")
	username = input ("Please enter your user-name (if applicable): ")
	print ( "Note: Password will not appear when typed.")
	password = getpass.getpass(prompt="Please enter your password (if applicable): ")
	
	successes = []
	failures =[]
	
	print ("\n\nRunning:\n\n---------------------------------------------------\n\n")
	print ("Document Name\t\t\tHTML Status Code (201 is Success)")
	for i in upload_listing:
		f = open ( i, 'r')
		data = f.read()
		doc_url= couchdb + "/" + db + "/" + get_uuid(couchdb)
		r = requests.put(doc_url, data=data, auth=(username,password))
		print (i.ljust(31) , repr(r).rjust(33))
		if r.status_code == requests.codes.created:
			successes.append(i)
		else:
			failures.append(i)
	
	print ("\n\n---------------------------------------------------\n\n")
	print ("Successful Uploads: " + repr(len(successes)))
	print ("Failed Uploads: " + repr(len(failures)))
	if len(failures)>0:
		print ("\n\nThese files failed to upload (Most likely due to malformed JSON):")
		print ("If the only files below are .csv, .map, or .py files,\n(most likely) nothing went wrong.\n")
		for i in failures:
			print ("\t" + i)
	print ("\n\nDone\n\n---------------------------------------------------\n\n")

# .............................................................................
def download_json():

    couchdb = raw_input("URL of the CouchDB installation (not username or password): ")
    if len(couchdb) < 3: couchdb = "http://localhost:5984"
    if couchdb.endswith('/'): couchdb = couchdb[:-1]
    db = raw_input("Database name : ")
    if db.endswith('/'): db = db[:-1]
    
    username = raw_input("User-name (if applicable): ")
    password = getpass.getpass(prompt="Password (if applicable, will not display): ")
  
    db_url = couchdb + "/" + db + "/"
    all_docs_url = db_url + "_all_docs"
    all_docs = requests.get(all_docs_url)
    doc_ids = []
    doc_ids_raw = re.findall("\"id\":\".*?\"", all_docs.text)
    for i in doc_ids_raw:
        doc_ids.append(i[6:-1])

    count = 0
    for i in doc_ids:
        count += 1
        doc_url = db_url + i
        if username == "":
            r = requests.get(doc_url)
        else:
            r = requests.get(doc_url, auth=(username, password))

        outFileName = db + "_" + repr(count)+ ".json"
        out = codecs.open(outFileName, 'w', 'utf-8')
        out.write(json.dumps(r.json(), indent=2))
        out.close()
        if ( count%10 ) == 0:
            print(" ... " + repr(count).rjust(4) + " / " + repr(len(doc_ids)).rjust(4))

    print ("\nNumber of Downloads Completed: " + repr(count))

# .............................................................................
def prune_db():
	print("< prune_db > subroutine called:")
	print( 
"""
Please do not enter username and password here. 
Remember to enter http:// or similar and please refrain from
using a trailing forward slash ("/").

Press return to use http://localhost:5984 .
""")
	couchdb= input("Please enter the URL of the CouchDB installation: ")
	if len(couchdb) < 3:
		couchdb = "http://localhost:5984"
	db = input ("Please enter the name of the database to prune (No / please) : ")
	username = input ("Please enter your user-name (if applicable): ")
	print ( "Note: Password will not appear when typed.")
	password = getpass.getpass(prompt="Please enter your password (if applicable): ")

	db_url = couchdb + "/" + db + "/"
	all_docs_url = db_url + "_all_docs"
	all_docs = requests.get( all_docs_url , auth=( username, password))
	doc_ids = []
	doc_ids_raw = re.findall("\"id\":\".*?\"", all_docs.text)
	for i in doc_ids_raw:
		doc_ids.append(i[6:-1])
	count=0
	del_count=0
	del_ids = []
	print("Working... This may take a while...")
	for i in doc_ids:
		count+=1
		doc_url = db_url + i
		r_raw= requests.get(doc_url, auth=(username,password))
		r_raw2 = re.sub("\" ?date ?\" ?: ?\[.*\]","", r_raw.text , re.DOTALL)
		r = re.sub("\" ?results ?\" ?: ?\[.*\]","", r_raw2 , re.DOTALL)
		match = None
		match = re.search( "\" ?type ?\" ?: ?\" ?measurement ?\" ?" ,r)
		if match:
			del_ids.append(i)
			del_count+=1
		
		if (count%25)==0:
			print(repr(count).rjust(4), "documents searched of ", repr(len(doc_ids)).rjust(4), ".")
	print(repr(count).rjust(4), "documents searched of ", repr(len(doc_ids)).rjust(4), ".")
	print ("\n\nNumber of documents to delete: " + repr(len(del_ids)))
	#print (del_ids)
	successes = []
	failures = []
	count=0
	print ("\n---------------------------------------------------\n")
	print("\n\nBeginning Delete Process... This may take a while...")
	for i in del_ids:
		count+=1
		doc_url = db_url + i
		
		rev_raw = requests.get( doc_url , auth=( username, password))
		rev_array = re.findall("\"_?rev\":\".*?\"", rev_raw.text)
		rev = rev_array[0][7:].replace("\"","")
		del_url = db_url + i + "?rev=" + rev
		#print (del_url)
		r = requests.delete(del_url, auth=(username,password))
		#print (r, r.text)
		if (count%25)==0:
			print(repr(count).rjust(4), "documents processed of ", repr(len(del_ids)).rjust(4), ".")
		if r.status_code == requests.codes.ok:
			successes.append(i)
		else:
			failures.append(i)
	if len(failures)>0:
		print ("\n\nThese files did not delete:")
		for i in failures:
			print ("\t" + i)
		print ("\n\n")
	print ("Documents Searched: ", repr(len(doc_ids)).rjust(38))
	print ("Documents Identified for Deletion: ",repr(len(del_ids)).rjust(23))
	print ("Documents Successfully Deleted :", repr(len(successes)).rjust(26))
	print ("Documents Identified for Deletion, but NOT Deleted: ", repr(len(failures)).rjust(6))
	print ("\n\nDone\n\n---------------------------------------------------\n\n")

#Allows execution as a script or as a module
if __name__ == '__main__':
	main()
