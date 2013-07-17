#!/usr/bin/python

# ================
# databaseTools.py 
# ================
#
#    See README.md
#
#             ===============
#    Based on RadioDBTools.py by Ben Wise.
#             ===============
#
#    This code is heavily based upon an open source code developed by Ben Wise:
#
#    --------------------------------------------------------------------------
#    Name:           RadioDBTools.py
#    Purpose:        To allow easy interfacing (uploading, downloading)
#                    with a CouchDB instance.
#
#    Creator:        Ben Wise
#    Email:          bwise@smu.edu
#
#    Created:        27/06/2013
#    Copyright:      (c) Ben Wise 2013
#    Licence:        GNU General Public License
#    Version:        1.0
#    --------------------------------------------------------------------------

import sys
import os
import getpass
import re
import requests
import json
import codecs

name = "RadioDBTools.py"
MADFversion = "2.01"


def help():
    """Help menu"""
    print("< help > subroutine called:"
          "\nWelcome to " + name +
          "\nUsage: python" + name + "[-u|-d|-h]"
          "\n\nOptions:\n"
          "-u : Uploads .json files to a couchdb instance of your choice.\n"
          "     Useage: python" + name + "-u [URL] [.Extension].\n"
          "     Optional parameter URL accepts full URL's and automatically\n"
          "     uploads all documents in current directory.\n"
          "     Optional parameter. Extension tells program to ignore\n"
          "     all files without a certain extension, i.e. .json files.\n"
          "     (Note: The \".\" is a required character.)"
          "-d : Downloads .json files from a couchdb instance of\n"
          "     your choice.\n"
          "     Useage: python" + name + "-d [URL].\n"
          "     Optional parameter URL accepts full URL's and automatically\n"
          "     downloads all documents in specified database.\n"
          "-p : Prunes (Deletes) all files of type \"measurement\" from a\n"
          "     couchdb instance of your choice.\n"
          "     Useage: python" + name + "-p.\n\n"
          "URL Format: http[s]://[username:password@]CouchDBName.com[:port]/DBName\n"
          "ex.: http://localhost:5984/database1\n"
          "     https://ben:mypassword@radiopurity.org/database1")


def main():
    """Calls the different subroutines based on command line arguments"""
    if len(sys.argv) > 1:
        if sys.argv[1] == "-h":
            help()
        elif sys.argv[1] == "-u":
            if len(sys.argv) > 1 and len(sys.argv) < 5:
                upload_json()
            else:
                help()
                print("\n*******\nERROR:\n"
                      "Incorrect number of arguments.\n*******\n")
        elif sys.argv[1] == "-d":
            if len(sys.argv) > 1 and len(sys.argv) < 4:
                download_json()
            else:
                help()
                print("\n*******\nERROR:\n"
                      "Incorrect number of arguments.\n*******\n")
        elif sys.argv[1] == "-p":
            if len(sys.argv) == 2:
                prune_db()
            else:
                help()
                print("\n*******\nERROR:\n"
                      "Incorrect number of arguments.\n*******\n")
        else:
            help()
            print("\n*******\nERROR:\nUnknown or incorrect argument. "
                  "Could not parse <" +
                  sys.argv[1] +
                  ">. \nPlease try again.\n*******\n")
    else:
        help()
        print("\n*******\nERROR\nNo argument specified.\n"
              "Please try again.\n*******\n")


def get_uuid(db):
    import requests
    uuid_url = db + "/_uuids"
    uuid = requests.get(uuid_url).text[11:][:-4]
    return uuid


def upload_json():
    """Upload JSON documents to a CouchDB"""
    validate = True
    try:
        import validateJSON
    except:
        print("validateJSON.py not found. Skipping Validation.")
        validate = False

    command_line_override = False
    use_extension = False
    extension = ""
    if len(sys.argv) > 2 and sys.argv[2][0] != ".":
        try:
            temp = re.findall("/.*?:", sys.argv[2])
            if len(temp) > 0:
                username = temp[0].replace("/", "").replace(":", "")
                print("Using user name : ", username)
            else:
                username = ""
                print("No user name found. Continuing without user name.")
            temp = []
            temp = re.findall(":[^/]*?@", sys.argv[2])
            if len(temp) > 0:
                password = temp[0].replace("@", "").replace(":", "")
                print("Using password : ", password)
            else:
                password = ""
                print("No password found. Continuing without password.")
            try:
                url = re.findall("@.*",
                          sys.argv[2])[0].replace("@", "").replace("://", "")
            except:
                url = re.findall("://.*",
                          sys.argv[2])[0].replace("@", "").replace("://", "")

            couchdb, temp, db = url.rpartition("/")
            print("Using CouchDB URL : ", couchdb)
            print("Using Database Name: ", db)
            if couchdb == "" or db == "":
                raise
            couchdb = "http://" + couchdb
            command_line_override = True
        except:
            print("\n\nFailed to find username/password/CouchDB "
                  "URL/Database Name.\n"
                  "Proceeding with prompt based input.\n\n")

    if len(sys.argv) > 2:
        if sys.argv[2][0] == ".":
            extension = sys.argv[2]
            use_extension = True
        elif len(sys.argv) > 3 and sys.argv[3][0] == ".":
            extension = sys.argv[3]
            use_extension = True

    pwd = os.getcwd()
    msg = "Upload all files in\n" + pwd + "\n(y/N) ? "
    if command_line_override:
        uploadAll = "y"
    else:
        uploadAll = raw_input(msg).lower()

    dirListing = []
    if use_extension:
        for i in os.listdir(pwd):
            if extension in i:
                dirListing.append(i)
    else:
        dirListing = os.listdir(pwd)

    if uploadAll == "y":
        uploadListing = dirListing
    else:
        print("\n")
        uploadListing = []
        for i in dirListing:
            msg = "Would you like to upload " + i + " (Y/N) ? "
            upload = raw_input(msg).lower()
            if upload == "y":
                uploadListing.append(i)

    if uploadListing == []:
        print("No applicable files found. Aborting Upload.")
        exit()

    if not command_line_override:
        couchdb = raw_input("CouchDB URL (no username or password,"
                            " enter for localhost) : ")
        if len(couchdb) < 3:
            couchdb = "http://localhost:5984"
        if couchdb.endswith('/'):
            couchdb = couchdb[:-1]
        db = raw_input("Database name : ")
        if db.endswith('/'):
            db = db[:-1]
        username = raw_input("User-name (if applicable) : ")
        password = getpass.getpass(prompt="Password (if applicable, "
                                          "will not display) : ")

    successes = []
    failures = []
    invalid = []

    print("\n Document Name           HTML Status Code (201 is Success)")
    for i in uploadListing:
        if validate:
            if validateJSON.is_valid_JSON(i):
                f = open(i, 'r')
                data = f.read()
                doc_url = couchdb + "/" + db + "/" + get_uuid(couchdb)
                r = requests.put(doc_url, data=data,
                                 auth=(username, password))
                print(' ' + i.ljust(31) + repr(r).rjust(26))
                if r.status_code == requests.codes.created:
                    successes.append(i)
                else:
                    failures.append(i)
            else:
                invalid.append(i)
        else:
            f = open(i, 'r')
            data = f.read()
            doc_url = couchdb + "/" + db + "/" + get_uuid(couchdb)
            r = requests.put(doc_url, data=data,
                             auth=(username, password))
            print(' ' + i.ljust(31) + repr(r).rjust(26))
            if r.status_code == requests.codes.created:
                successes.append(i)
            else:
                failures.append(i)

    print("\nSuccessful Uploads         : " + repr(len(successes)))
    print("Failed Uploads             : " + repr(len(failures)))
    print("Failed due to invalid JSON : " + repr(len(invalid)))
    if len(failures) > 0:
        print("\nThese files failed to upload:")
        for i in failures:
            print("   " + i)
    if len(invalid) > 0:
        print("\nThese files failed to upload due to invalid JSON :")
        for i in invalid:
            print("   " + i)
    print("")


def download_json():
    """Download JSON documents from a CouchDB"""
    command_line_override = False

    if len(sys.argv) == 3:
        try:
            temp = re.findall("/.*?:", sys.argv[2])
            if len(temp) > 0:
                username = temp[0].replace("/", "").replace(":", "")
                print("Using user name : ", username)
            else:
                username = ""
                print("No user name found. Continuing without user name.")
            temp = []
            temp = re.findall(":[^/]*?@", sys.argv[2])
            if len(temp) > 0:
                password = temp[0].replace("@", "").replace(":", "")
                print("Using password : ", password)
            else:
                password = ""
                print("No password found. Continuing without password.")
            try:
                url = re.findall("@.*",
                    sys.argv[2])[0].replace("@", "").replace("://", "")
            except:
                url = re.findall("://.*", 
                    sys.argv[2])[0].replace("@", "").replace("://", "")

            couchdb, temp, db = url.rpartition("/")
            print("Using CouchDB URL : ", couchdb)
            print("Using Database Name: ", db)
            if couchdb == "" or db == "":
                raise
            couchdb = "http://" + couchdb
            command_line_override = True
        except:
            print("\n\nFailed to find "
                  "username/password/CouchDB URL/Database Name."
                  "Proceeding with prompt based input.\n\n")

    if not command_line_override:
        couchdb = raw_input("CouchDB URL (no username "
                            "or password, enter for localhost) : ")
        if len(couchdb) < 3:
            couchdb = "http://localhost:5984"
        if couchdb.endswith('/'):
            couchdb = couchdb[:-1]
        db = raw_input("Database name : ")
        if db.endswith('/'):
            db = db[:-1]
        username = raw_input("User-name (if applicable) : ")
        password = getpass.getpass(
            prompt="Password (if applicable, will not display) : ")

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

        outFileName = db + "_" + repr(count) + ".json"
        out = codecs.open(outFileName, 'w', 'utf-8')
        out.write(json.dumps(r.json(), indent=2))
        out.close()
        if count % 10 == 0:
            print(" downloading ... " + repr(count).rjust(4) +
                  " / " + repr(len(doc_ids)).rjust(4))

    print("\nNumber of Downloads Completed: " + repr(count) + '\n')


def prune_db():
    """Delete all documents of type 'measurement' from a CouchDB"""
    try:  # Fix Python 2.x.
        raw_input = input
    except NameError:
        pass

    print("Warning: This operation will DELETE documents"
          "from the database in question!")
    couchdb = raw_input("CouchDB URL (no username or password,"
                        "enter for localhost) : ")
    if len(couchdb) < 3:
        couchdb = "http://localhost:5984"
    if couchdb.endswith('/'):
        couchdb = couchdb[:-1]
    db = raw_input("Database name : ")
    if db.endswith('/'):
        db = db[:-1]
    username = raw_input("User-name (if applicable) : ")
    password = getpass.getpass(
        prompt="Password (if applicable, will not display) : ")

    print("Working... This may take some time...")
    db_url = couchdb + "/" + db + "/"
    all_docs_url = db_url + "_all_docs"
    all_docs = requests.get(all_docs_url, auth=(username, password))
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
        r_raw2 = re.sub("\" ?date ?\" ?: ?\[.*\]", "", r_raw.text, re.DOTALL)
        r = re.sub("\" ?results ?\" ?: ?\[.*\]", "", r_raw2, re.DOTALL)
        match = None
        match = re.search("\" ?type ?\" ?: ?\" ?measurement ?\" ?", r)
        if match:
            del_ids.append(i)
            del_count += 1
        if count % 10 == 0:
            print(" searching ... " + repr(count).rjust(4) +
                  " / " + repr(len(doc_ids)).rjust(4))

    print("\nNumber of documents to delete: " + repr(len(del_ids)))
    print("\nPlease confirm deletion of the following documents:")
    for i in del_ids:
        print("-> ", i)
    prompt = "\n\nDelete all " + repr(len(del_ids)) + " Documents ? (Y/n) "
    confirm_delete = raw_input(prompt)
    if confirm_delete.lower() != "y":
        print("Exiting: Delete operation aborted.")
        exit()
    else:
        print("Working... This may take some time...")
        successes = []
        failures = []
        count = 0

        for i in del_ids:
            count += 1
            doc_url = db_url + i
            rev_raw = requests.get(doc_url, auth=(username, password))
            rev_array = re.findall("\"_?rev\":\".*?\"", rev_raw.text)
            rev = rev_array[0][7:].replace("\"", "")
            del_url = db_url + i + "?rev=" + rev
            r = requests.delete(del_url, auth=(username, password))
            if count % 10 == 0:
                print(" pruning ... " + repr(count).rjust(4) +
                      " / " + repr(len(doc_ids)).rjust(4))
            if r.status_code == requests.codes.ok:
                successes.append(i)
            else:
                failures.append(i)

        if len(failures) > 0:
            print("\n\nThese files were not deleted :")
            for i in failures:
                print ("\t" + i)
            print("\n\n")
        print("\nDocuments searched                               : " +
              repr(len(doc_ids)).rjust(5))
        print("Documents identified for deletion                  : " +
              repr(len(del_ids)).rjust(5))
        print("Documents successfully deleted                     : " +
              repr(len(successes)).rjust(5))
        print("Documents identified for deletion, but NOT deleted : " +
              repr(len(failures)).rjust(5)) + "\n"

if __name__ == '__main__':
    main()
