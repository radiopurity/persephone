#!/usr/bin/python

#
# ================
# databaseTools.py
# ================
#
#    Simple database tools:
#
#       - Batch upload assays to a CouchDB
#       - Batch download assays from a CouchDB
#       - Batch delete (prune) assays from a CouchDB
#           
#    Assays need to be text files in JSON format.
#    See README.md for more details.
#
#             ===============
#    Based on RadioDBTools.py by Ben Wise.
#             ===============
#
#    This code is heavily based upon an open source code developed by Be Wise:
#
#       -------------------------------------------------------------------------------
#       Name:           RadioDBTools.py
#       Purpose:        To allow easy interfacing (uploading, downloading) with a CouchDB
#                       instance.
#        
#       Creator:        Ben Wise
#       Email:          bwise@smu.edu
#       
#       Created:        27/06/2013
#       Copyright:      (c) Ben Wise 2013
#       Licence:        GNU General Public License
#       Version:        1.0
#       -------------------------------------------------------------------------------
#

import sys
import os
import getpass
import re
import requests
import json
import codecs

name = "RadioDBTools.py"
MADFversion = "2.01"

# .............................................................................
# Help menu
def help():
    print ("< help > subroutine called:")
    print ("\nWelcome to " + name)
    print ("\nUsage: python" + name + "[-u|-d|-h]")
    print ("\n\nOptions:\n")
    print ("-u : Uploads .json files to a couchdb instance of your choice.\n")
    print ("	 Useage: python" + name + "-u.\n")
    print ("-d : Downloads .json files from a couchdb instance of your choice.\n")
    print ("	 Useage: python" + name + "-d.\n")
    print ("-p : Prunes (Deletes) all files of type \"measurement\" from a couchdb instance of your choice.\n")
    print ("	 Useage: python" + name + "-p.\n")

# .............................................................................
# Calls the different subroutines based on command line arguments
def main():

    if len(sys.argv) > 1 :

    	if sys.argv[1] == "-h":
       	    help()
    	elif sys.argv[1] == "-u":
    	    if len(sys.argv) == 2:
       		upload_json()
       	    else:
       	        help()
       	        print ("\n*******\nERROR:\nIncorrect number of arguments.\n*******\n")
    	elif sys.argv[1] == "-d":
    	    if len(sys.argv) == 2:
    	        download_json()
    	    else:
    	        help()
    		print ("\n*******\nERROR:\nIncorrect number of arguments.\n*******\n")
    	elif sys.argv[1] == "-p":
    	    if len(sys.argv) == 2:
    	        prune_db()
    	    else:
    	        help()
    	        print ("\n*******\nERROR:\nIncorrect number of arguments.\n*******\n")
    	else:
    	    help()
    	    print("\n*******\nERROR:\nUnknown or incorrect argument. Could not parse <" + sys.argv[1] + ">. \nPlease try again.\n*******\n")
    else:
    	help()
    	print("\n*******\nERROR\nNo argument specified.\nPlease try again.\n*******\n")

# .............................................................................
def get_uuid(db):

    import requests
    uuid_url = db + "/_uuids"
    uuid = requests.get(uuid_url).text[11:][:-4]
	
    return uuid

# .............................................................................
# Upload JSON documents to a CouchDB
def upload_json():

    pwd = os.getcwd()
    msg = "Upload all files in\n" + pwd + "\n(Y/N) ? "
    uploadAll = raw_input(msg).lower()

    if uploadAll == "y":
    	uploadListing = os.listdir(pwd)
    else:
    	print("\n")
    	uploadListing =[]
    	dirListing = os.listdir(pwd)
    	for i in dirListing:
       	    msg = "Would you like to upload " + i + " (Y/N) ? "
    	    upload = raw_input(msg).lower()
    	    if upload== "y":
    	    	uploadListing.append(i)

    couchdb = raw_input("CouchDB URL (no username or password, enter for localhost) : ")
    if len(couchdb) < 3: couchdb = "http://localhost:5984"
    if couchdb.endswith('/'): couchdb = couchdb[:-1]
    db = raw_input("Database name : ")
    if db.endswith('/'): db = db[:-1]
    username = raw_input("User-name (if applicable) : ")
    password = getpass.getpass(prompt="Password (if applicable, will not display) : ")
    
    successes = []
    failures  = []
    
    print ("\n Document Name           HTML Status Code (201 is Success)")
    for i in uploadListing:
    	f = open ( i, 'r')
    	data = f.read()
    	doc_url = couchdb + "/" + db + "/" + get_uuid(couchdb)
        r = requests.put(doc_url, data = data, auth = (username, password))
    	print(' ' + i.ljust(31) + repr(r).rjust(26))
    	if r.status_code == requests.codes.created:
    	    successes.append(i)
    	else:
    	    failures.append(i)
    
    print ("\nSuccessful Uploads : " + repr(len(successes)))
    print ("Failed Uploads     : " + repr(len(failures)))
    if len(failures) > 0:
    	print ("\nThese files failed to upload:")
    	for i in failures:
    	    print ("   " + i)
    print ''

# .............................................................................
# Download JSON documents from a CouchDB
def download_json():

    couchdb = raw_input("CouchDB URL (no username or password, enter for localhost) : ")
    if len(couchdb) < 3: couchdb = "http://localhost:5984"
    if couchdb.endswith('/'): couchdb = couchdb[:-1]
    db = raw_input("Database name : ")
    if db.endswith('/'): db = db[:-1]
    username = raw_input("User-name (if applicable) : ")
    password = getpass.getpass(prompt="Password (if applicable, will not display) : ")

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
        r = requests.get(doc_url, auth=(username, password))

        outFileName = db + "_" + repr(count)+ ".json"
        out = codecs.open(outFileName, 'w', 'utf-8')
        out.write(json.dumps(r.json(), indent=2))
        out.close()
        if count % 10 == 0:
            print(" downloading ... " + repr(count).rjust(4) + " / " + repr(len(doc_ids)).rjust(4))

    print ("\nNumber of Downloads Completed: " + repr(count) + '\n')

# .............................................................................
# Delete all documents of type 'measurement' from a CouchDB
def prune_db():

    couchdb = raw_input("CouchDB URL (no username or password, enter for localhost) : ")
    if len(couchdb) < 3: couchdb = "http://localhost:5984"
    if couchdb.endswith('/'): couchdb = couchdb[:-1]
    db = raw_input("Database name : ")
    if db.endswith('/'): db = db[:-1]
    username = raw_input("User-name (if applicable) : ")
    password = getpass.getpass(prompt="Password (if applicable, will not display) : ")

    db_url = couchdb + "/" + db + "/"
    all_docs_url = db_url + "_all_docs"
    all_docs = requests.get( all_docs_url , auth=( username, password))
    doc_ids = []
    doc_ids_raw = re.findall("\"id\":\".*?\"", all_docs.text)
    for i in doc_ids_raw:
    	doc_ids.append(i[6:-1])

    count = 0
    del_count = 0
    del_ids = []
    for i in doc_ids:
    	count += 1
    	doc_url = db_url + i
        r_raw = requests.get(doc_url, auth=(username, password))
    	r_raw2 = re.sub("\" ?date ?\" ?: ?\[.*\]","", r_raw.text , re.DOTALL)
    	r = re.sub("\" ?results ?\" ?: ?\[.*\]","", r_raw2 , re.DOTALL)
    	match = None
    	match = re.search( "\" ?type ?\" ?: ?\" ?measurement ?\" ?" ,r)
    	if match:
    	    del_ids.append(i)
    	    del_count += 1
    	if count % 10 == 0:
            print(" searching ... " + repr(count).rjust(4) + " / " + repr(len(doc_ids)).rjust(4))

    print ("\nNumber of documents to delete: " + repr(len(del_ids)))
    successes = []
    failures = []
    count = 0

    for i in del_ids:
    	count += 1
    	doc_url = db_url + i
    	rev_raw = requests.get( doc_url , auth=( username, password))
    	rev_array = re.findall("\"_?rev\":\".*?\"", rev_raw.text)
    	rev = rev_array[0][7:].replace("\"","")
    	del_url = db_url + i + "?rev=" + rev
    	r = requests.delete(del_url, auth=(username,password))
    	if count % 10 == 0:
            print(" pruning ... " + repr(count).rjust(4) + " / " + repr(len(doc_ids)).rjust(4))
    	if r.status_code == requests.codes.ok:
    	    successes.append(i)
    	else:
    	    failures.append(i)

    if len(failures) > 0:
    	print ("\n\nThese files were not deleted :")
    	for i in failures:
    		print ("\t" + i)
    	print ("\n\n")
 
    print ''
    print ("Documents searched                                 : " + repr(len(doc_ids)).rjust(5))
    print ("Documents identified for deletion                  : " + repr(len(del_ids)).rjust(5))
    print ("Documents successfully deleted                     : " + repr(len(successes)).rjust(5))
    print ("Documents identified for deletion, but NOT deleted : " + repr(len(failures)).rjust(5))
    print ''

# .............................................................................
# Allows execution as a script or as a module
if __name__ == '__main__':
	main()
