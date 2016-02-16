#!/usr/local/bin/python3
"""
Uploads some assays from separate files into a database
"""

import couchdb
import shutil
import os
import json


# Location of couchdb server
couchdb_location = 'http://admin:admin@localhost:5984/'

# Name of database (must exist)
database_name = 'test'

# Directory where the JSON files are stored
source_dir = './download'

# Connect to couchdb
couch = couchdb.Server(couchdb_location)

# Get the database
db = couch[database_name]

# Get the list of files
files_to_upload = []
for f in os.listdir(source_dir):
    if f.endswith('.json'):
        files_to_upload.append(f)

# Process the files
for f in files_to_upload:
    file_name = '%s/%s' % (source_dir, f)
    with open(file_name) as fin:
        assay = json.load(fin)
        # Upload the assay if it looks like a real one
        if 'type' in assay:
            if assay['type'] == 'measurement':
                db.save(assay)
