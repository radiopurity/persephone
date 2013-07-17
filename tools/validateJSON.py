#!/usr/bin/python

# ===============
# validateJSON.py
# ===============
#
#    See README.md.
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

import sys

MADF_version = "2.01"
schema_dir = "../_attachments/schema"
default_schema_file = "%s/v%s.schema.json" % (schema_dir, MADF_version)


def is_valid_JSON(doc_name, schema_file=default_schema_file):

    """Does JSON validation, returns True if valid, False otherwise"""

    import json
    import os
    try:
        import jsonschema
    except:
        print("Failed to load jsonschema. No validation possible.")
        raise

    try:
        schema = json.loads(open(schema_file).read())
    except:
        print("\n\nValid schema failed to Open/Load.\n"
              "Please make sure you have the schema.json file "
              "in this directory.\nYou may also need to change the "
              "schema_file variable in validateJSON.py\n\n")
        raise

    data = json.loads(open(doc_name).read())
    # This will raise an Exception if data doesn't match the schema
    # otherwise is returns None
    try:
        jsonschema.validate(data, schema)
    except:
        # print(doc_name," Failed to validate correctly.")
        return False
    else:
        return True


def main():
    """Validates all .json files in directory"""

    try:  # Fix Python 2.x.
        if sys.version_info>=(3,0):
            modified_input = input
            print("Python 3.x Compatible!")
        else:
            modified_input=raw_input
    except NameError:
        pass
    
    print("\nAssay validator:\n\n")
    import os

    all_files = False
    if len(sys.argv) == 1:  # Validating a list of files
        all_files = True
  

    file_list = []

    if all_files == True:
        pwd = os.getcwd()
        for i in os.listdir(pwd):
            if ".json" in i and not i == default_schema_file:
                file_list.append(i)
        if file_list == []:
            print("No JSON files found.")
            exit()
    else:
        for i in sys.argv:
            if i != sys.argv[0]:
                file_list.append(i)

    print("File Name                                    Valid assay?")
    for i in file_list:
        print(i.ljust(33) + repr(is_valid_JSON(i,
                                 default_schema_file)).rjust(16))


if __name__ == '__main__':
    main()
