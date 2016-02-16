#!/usr/bin/python

# ============
# generateSearchIndice.py
# ============
#
#    --------------------------------------------------------------------------
#    Name:           generateSearchIndice.py
#    Purpose:        Generate the search indices of Uranium and Thorium for Lucene search.
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

    return doc

"""
Calculate search indices for isotopes: Uranium and Thorium.
Unit Convert specifics:
    1000000 * ppt = 1000 * ppb = ppm
    1000000 * nBq/kg = 1000 * uBq/kg = mBq/kg

Arguments:
    doc : the input measurement JSON
"""
def addSearchIndice(doc):
    unit = {"ppt":1 , "ppb":1000 , "ppm":1000000 , 
            "nBq/kg":1 , "uBq/kg":1000 , "muBq/kg":1000 ,
            "mBq/kg":1000000 , "Bq/kg":1000000000
            }

    from sets import Set
    Th_list = Set(["Th", "Th-232", "232-Th", "Th232", "232Th"])
    U_list = Set(["U", "U-238", "238-U", "U238", "238U"])

    doc.update(
            {'sort_indices':
                    {
                        "th":999999999, 
                        "u":999999999
                    }
            })

    for i in range(len(doc["measurement"]["results"])):
        if(doc["measurement"]["results"][i]["isotope"] in Th_list):
            if(unit.has_key(doc["measurement"]["results"][i]["unit"])):

                tvalue = doc["measurement"]["results"][i]["value"][0] * \
                    unit[doc["measurement"]["results"][i]["unit"]]
                doc["sort_indices"]["th"] = float(tvalue)

            elif(doc["sort_indices"]["th"] == 999999999):

                doc["sort_indices"]["th"] = 99999999

        elif (doc["measurement"]["results"][i]["isotope"] in U_list):
            if(unit.has_key(doc["measurement"]["results"][i]["unit"])):

                uvalue = doc["measurement"]["results"][i]["value"][0] * \
                    unit[doc["measurement"]["results"][i]["unit"]]
                doc["sort_indices"]["u"] = float(uvalue)

            elif(doc["sort_indices"]["u"] == 999999999):

                doc["sort_indices"]["u"] = 99999999

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

        json_data = addSearchIndice(json_data)

        json_file.close()

        json_file = open(filename,"w")
        json_file.write(json.dumps(json_data))

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
