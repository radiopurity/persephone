#!/usr/local/bin/python3
"""
Uploads some assays from separate files into a database
"""

import couchdb
import shutil
import os
import json
import jsonschema


# Location of couchdb server (with un, pw if required)
couchdb_location = 'http://admin:admin@localhost:5984/'

# Name of database (must exist)
database_name = 'test'

# Directory where the JSON files to upload are stored
source_dir = './download'

# Directory where the uploaded JSON files are stored
uploaded_dir = './uploaded'

# Schema file
schema_file = "../_attachments/schema/v3.00.schema.json"


# Connect to couchdb
couch = couchdb.Server(couchdb_location)

# Get the database
db = couch[database_name]

# Prepare uploaded directory
if not os.path.exists(uploaded_dir):
    os.makedirs(uploaded_dir)

# Get the list of files
files_to_upload = []
for f in os.listdir(source_dir):
    if f.endswith('.json'):
        files_to_upload.append(f)

# Load schema
schema = json.loads(open(schema_file).read())

# Process the files
# Move uploaded files to a subdirectory so they are not
# double-uploaded when the script is re-run
for f in files_to_upload:
    file_name = '%s/%s' % (source_dir, f)
    with open(file_name) as fin:
        assay = json.load(fin)
        # Check the assay satisfies the schema
        try:
            # Check for validity and upload if successful
            jsonschema.validate(assay, schema)
            db.save(assay)
            shutil.move(file_name, uploaded_dir)
        except jsonschema.ValidationError as e:
            # Validation error
            print("\nERROR in %s:" % file_name)
            print(e.message)
        except jsonschema.SchemaError as e:
            # Schema error
            print("\nERROR in %s:" % file_name)
            print(e)
