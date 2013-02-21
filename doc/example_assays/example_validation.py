import jsonschema  #https://github.com/Julian/jsonschema
import json

schema = json.loads(open('_attachments/schema/aarm.measurement.v2.01.schema.json').read())
data = json.loads(open('doc/example_assays/example_v2.01_date.json').read())

#this will raise an Exception if data doesn't match the schema
#otherwise is returns None
jsonschema.validate(data, schema)

print 'valid'
