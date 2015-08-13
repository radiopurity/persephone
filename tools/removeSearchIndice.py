#!/usr/bin/python

# ============
# generateSearchIndice.py
# ============
#
#    --------------------------------------------------------------------------
#    Name:           generateSearchIndice.py
#    Purpose:        Remove the search indices of Uranium and Thorium for Lucene search.
#         
#    Author:         Zheng Li
#    Email:          ronnie.alonso@gmail.com
#
#    Created:        23/07/2013
#    Copyright:      (c) Zheng Li 2013
#    Licence:        GNU General Public License
#    Version:        1.2
#    --------------------------------------------------------------------------

import os , json , glob , string , sys
"""
Modify the JSON type to satisfy the json schema.

Arguments:
    doc : the input measurement JSON
"""
def modifySchemaType(doc):

    """ Modify measurement results to change all the value to a float"""
    if (doc["measurement"].has_key("results")):
        for i in range(len(doc["measurement"]["results"])):
            for j in range(len(doc["measurement"]["results"][i]["value"])):

                if isinstance(doc["measurement"]["results"][i]["value"][j], (str , unicode)):
                    doc["measurement"]["results"][i]["value"][j] =  float(doc["measurement"]["results"][i]["value"][j])

    """ Replace the date entry which has value of "" to value of [] """
    if (doc["measurement"].has_key("date")):

        if isinstance(doc["measurement"]["date"], (str , unicode)):
            doc["measurement"]["date"] = []

    """ Remove the _rev entry to avoid CouchDB 409 error """
    if(doc.has_key("_rev")):
        del doc["_rev"]
    if(doc.has_key("_id")):
        del doc["_id"]

    return doc

"""
Remove search indices for isotopes: Uranium and Thorium.

Arguments:
    doc : the input measurement JSON
"""
def removeSearchIndice(doc):
    if(doc.has_key("sort_indices")):
        del doc["sort_indices"]
    return doc

# _dir_ : "/mychr"
# _type_ : "*.json"
def openFile(_dir_ , _type_):
    os.chdir(_dir_)
    print "Filename\t\t\t\tStatus"
    for filename in glob.glob(_type_):
        json_file = open(filename)
        json_data = json.load(json_file)

        json_data = modifySchemaType(json_data)

        json_data = removeSearchIndice(json_data)

        json_file.close()

        json_file = open(filename,"w")
        json_file.write(json.dumps(json_data, indent=4))

        json_file.close()

        print filename + "\t\t\t\tCompleted"

if __name__ == '__main__':
    """Calls the different subroutines based on command line arguments"""
    print "usage: python generateSearchIndice.py -d [directory] -f [filename]"
    print "without option, the default directory is ./ and the default file is *.json"
    print "[directory] : './' ; [filename] : '*.json'"
    directory = "./"
    filename = "*.json"
    if len(sys.argv) == 5:
        if sys.argv[1] == "-d":
            directory = sys.argv[2]
        if sys.argv[3] == "-f":
            filename = sys.argv[4]
        openFile(directory , filename)
    elif len(sys.argv) == 1:
        openFile(directory , filename)
    else:
        pass;
