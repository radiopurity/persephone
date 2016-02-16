#!/usr/local/bin/python3
"""
Download all assays from a database into separate files
"""

import couchdb
import shutil
import os
import json


# Location of couchdb server (with un, pw if required)
couchdb_location = 'http://admin:admin@localhost:5984/'

# Name of database (must exist)
database_name = 'rp'

# Folder to download to (need not exist)
output_folder = 'download'

# Connect to couchdb
couch = couchdb.Server(couchdb_location)

# Get the database
db = couch[database_name]

# Prepare output directory
if os.path.exists(output_folder):
    shutil.rmtree(output_folder)
os.makedirs(output_folder)

# Iterate through all the documents in the database
counter = 0
for id in db:
    # Get the assay by its ID
    assay = db[id]
    # Remove couchdb document identifiers
    del assay['_rev']
    del assay['_id']
    # Process the assay if it looks like a real one
    if 'type' in assay:
        if assay['type'] == 'measurement':
            file_name = '%s/assay_%d.json' % (output_folder, counter)
            fout = open(file_name, 'w')
            fout.write(json.dumps(assay, indent=2))
            fout.close()
            counter += 1
