#!/usr/local/bin/python3
"""
Removes all assays from the database, leaving other documents alone
"""

import couchdb
import shutil
import os
import json


# Location of couchdb server (with un, pw if required)
couchdb_location = 'http://admin:admin@localhost:5984/'

# Name of database (must exist)
database_name = 'test'

# Connect to couchdb
couch = couchdb.Server(couchdb_location)

# Get the database
db = couch[database_name]

# Iterate through the documents in the database
for id in db:
    # Get the assay by its ID
    assay = db[id]
    # Process the assay if it looks like a real one
    if 'type' in assay:
        if assay['type'] == 'measurement':
            db.delete(assay)
