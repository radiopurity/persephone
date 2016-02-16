#!/usr/local/bin/python3
"""
Validates a .json files using the schema
"""

import json
import jsonschema

assay_file   = "download/assay_34.json"
schema_file  = "../_attachments/schema/v3.00.schema.json"

assay = open(assay_file).read()
schema = open(schema_file).read()

try:
    jsonschema.validate(json.loads(assay), json.loads(schema))
except jsonschema.ValidationError as e:
    print(e.message)
except jsonschema.SchemaError as e:
    print(e)
