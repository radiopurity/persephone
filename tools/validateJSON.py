#!/usr/bin/python

#    -------------------------------------------------------------------------------
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
#    -------------------------------------------------------------------------------
defaultschemafile="v2.01.schema.json"
# .............................................................................

#Doese JSON validation, returns True if valid, False otherwise
def is_valid_JSON(doc_name,schema_file=defaultschemafile):
    import json
    import os
    
    try:
        import jsonschema
    except:
        print("Failed to load jsonschema. No Validation Possible.")
        raise
    
    try:
        schema = json.loads(open(schema_file).read())
    except:
        print("\n\nValid Schema Failed to Open/Load.\nPlease make sure you have the schema.json file in this directory.\nYou may also need to change the schema_file variable in validateJSON.py\n\n")
        raise
    
    data = json.loads(open(doc_name).read())
    
    #this will raise an Exception if data doesn't match the schema
    #otherwise is returns None
    try:
        jsonschema.validate(data, schema)
    except:
        #print(doc_name," Failed to validate correctly.")
        return False
    else:
        return True

# .............................................................................

#Validates all .JSON files in directory
def main():
    print("\nJSON Validator:\n\n")
    import os
    
    # Fix Python 2.x
    try: raw_input = input
    except NameError: pass

    pwd = os.getcwd()
    dirListing=[]

    for i in os.listdir(pwd):
        if ".json" in i and not i==defaultschemafile:
            dirListing.append(i)
    
    if dirListing==[]:
        print("No applicable files found.")
        exit()
    
    print("File Name                                    Valid JSON?")

    for i in dirListing:
        print( i.ljust(33), repr(is_valid_JSON(i, defaultschemafile)).rjust(16))

# .............................................................................
# Allows execution as a script or as a module
if __name__ == '__main__':
    main()
