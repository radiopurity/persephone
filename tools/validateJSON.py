#!/usr/bin/python

# ===============
# validateJSON.py
# ===============
#
#    DESCRIPTION
#
#    USAGE
#    
#    OPTIONS
#
#             ===============
#    Based on validateJSON.py by Ben Wise.
#             ===============
#
#    This code is heavily based upon an open source code developed by 
#    Ben Wise. The original file header:
#
#    --------------------------------------------------------------------------
#    Name:           validateJSON.py
#    Purpose:        To facilitate JSON document validity checking.
#
#    Author:         Ben Wise
#    Email:          bwise@smu.edu
#
#    Created:        09 July 2013
#    Copyright:      (c) Ben Wise 2013
#    Licence:        GNU General Public License
#    Version:        1.0
#    --------------------------------------------------------------------------

defaultSchemaFile = "../_attachments/schema/v2.01.schema.json"

# .............................................................................
# Doese JSON validation, returns True if valid, False otherwise
def is_valid_JSON(docName,schemaFile=defaultSchemaFile):
    import json
    import os
    
    try:
        import jsonschema
    except:
        print("Failed to load jsonschema. No Validation Possible.")
        raise
    
    try:
        schema = json.loads(open(schemaFile).read())
    except:
        print("\n\nValid Schema Failed to Open/Load.\nPlease make sure you have the schema.json file in this directory.\nYou may also need to change the schemaFile variable in validateJSON.py\n\n")
        raise
    
    data = json.loads(open(docName).read())
    
    #this will raise an Exception if data doesn't match the schema
    #otherwise is returns None
    try:
        jsonschema.validate(data, schema)
    except:
        #print(docName," Failed to validate correctly.")
        return False
    else:
        return True

# .............................................................................
# Validates all .JSON files in directory
def main():
    print("\nJSON Validator:\n\n")
    import os
    
    # Fix Python 2.x
    try: raw_input = input
    except NameError: pass

    pwd = os.getcwd()
    dirListing=[]

    for i in os.listdir(pwd):
        if ".json" in i and not i==defaultSchemaFile:
            dirListing.append(i)
    
    if dirListing==[]:
        print("No applicable files found.")
        exit()
    
    print("File Name                                    Valid JSON?")

    for i in dirListing:
        print( i.ljust(33) + repr(is_valid_JSON(i, defaultSchemaFile)).rjust(16))

# .............................................................................
# Allows execution as a script or as a module
if __name__ == '__main__':
    main()
