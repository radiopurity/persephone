#!/usr/bin/python

# ============
# importCSV.py
# ============
#
#    DESCRIPTION
#
#    This code is for importing data in a CSV file into v2.01 of the
#    Material Assay Data Format (MADF). Import takes place in two stages: 
#    first a map is produced that specifies which columns in the CSV 
#    correspond to which fields in the data structure; second the data 
#    is converted, with one file being produced for each line in the CSV
#    file. Once these JSON files have been produced they can be imported
#    using the databaseTools.py program.
#
#    This code was written for importing data from the ILIAS database
#    (after outputting data from the SQL database into CSV files).
#
#    USAGE
#    
#    python csvImport.py [Options] [[import file name].map][[import file name].csv]
#
#    OPTIONS
#
#    -h : Display this help message.
#    -m : Create map for .csv file.
#         Will allow you to import specific columns of the csv file
#         into the fields of the MADF format.
#         Creates [import file name].map file for later use.
#         Useage: python csvImport.py -m [import file name].csv
#    -i : Imports the entire .csv file into MADF format.
#         Creates [import file name].X.txt files for each of X records
#         in [import file name].csv
#         Usage: python csvImport.py -i [import file name].map
#         [import file name].csv
#    -c : Allows you to concatenate results columns, when "<" and value or
#         value and error are in separate columns.
#         Useage: python csvImport.py -c [import file name].csv
#    -e : Prints Error Codes/Exit Status Definitions.
#
#             =============
#    Based on RadioTools.py by Ben Wise.
#             =============
#
#    This code is heavily based upon an open source code developed by 
#    Ben Wise. The original file header:
#
#    --------------------------------------------------------------------------
#    Name:           RadioTools.py
#    Purpose:        Import .csv files to Material Assay Data Format v 2.01.
#                    Map .csv files to MADF format for later use.
#         
#    Author:         Ben Wise
#    Email:          bwise@smu.edu
#
#    Created:        22/05/2013
#    Copyright:      (c) Ben Wise 2013
#    Licence:        GNU General Public License
#    Version:        1.2
#    --------------------------------------------------------------------------

import sys
import argparse
import csv
import datetime
import codecs
import os
import getpass
import json
import re

name        = "databaseTools.py"
MADFversion = "2.01"

# .............................................................................
# Gives explanations for custom error statuses
def error_definitions():
    print("< error_definitions > subroutine called:\n")
    print("Exit Status:\n")
    print("  0 : No Error. Exited Successfully.")
    print("  1 : Error during program execution.")
    print("  2 : Command Line Syntax Error.")
    print("  3 : Failed to open .csv file.")
    print("  4 : Problem reading csv file.")
    print("  5 : Input incorrectly formatted.")

# .............................................................................
# Reads the .csv file and returns it as a list
def read_csv(filename):
    result = []
    try:
        with open(filename,'r') as f:
            reader = csv.reader(f)
            try:
                for row in reader:
                     result.append(row)
            except csv.Error as e:
                print("Exit Status: 4")
                sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))
            return result
    except IOError:
        print("Exit Status: 3")
        sys.exit (3)

# .............................................................................
# Reads the map of the csv file
def read_map(filename):
    result = []
    try:
        with open(filename,'r') as f:
            reader = csv.reader(f, delimiter=' ')
            try:
                for row in reader:
                     result.append(row)
            except csv.Error as e:
                print ("Exit Status: 4")
                sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))
            return result
    except IOError:
        print("Exit Status: 3")
        sys.exit (3)

# .............................................................................
# Creates a map of the .csv file
def map():
    print("< map > subroutine called:")
    data = read_csv(sys.argv[2])
    record = data[0]
    print("\nNumber of Fields in one Record is:" + str(len(record)) + "\n")
    print("The Fields are: \n")
    for i in record:
        print (i)
    print("\n\nMADF Format Version:" + MADFversion + \
          "\nExample JSON Document For 1 Record")
    a = [" 1 ", " 2 ", " 3 ", " 4 ", " 5 ", " 6 ", " 7 ", " 8 ", " 9 ", \
         " 10 ", " 11 ", " 12 ", " 13 ", " 14 ", " 15 ", " 16 ", "[ 17 ]", \
         " 18 ", "", ""]
    format_json_to_screen(a)
    print("\n\nFor the following fields in the .csv document please input the number (shown above) where that field should go.")
    print("Note: that field number 17 is the only field that may have more than one field associated with it.")
    print("Please use option -c first if the \"<\" or error of the measurement are not in the same field as the measurement.")
    print("If there is a \"Units\" Column please denote this one as 19.")
    j = 0
    error = 0
    map_data = []
    for i in record:
        temp = -1
        while temp < 1 or temp > 19:
            try:
                message = i + ": "
                temp = int(input(message))
            except ValueError:
                print("\n*******\nERROR:\nInput must be a number.\n***" + \
                      "****\nExit Status: 5")
                sys.exit(5)

            for i in map_data:
                if i == temp:
                    error = 1
            if error == 1:
                print("You've already selected that field. Please try again.")
                temp = -1

            if temp < 1 or temp > 19:
                print("\n\nInvalid input. " + \
                      "Input must be between 1 and 20 (inclusive).\n\n")
                temp = -1

            if temp == 17:
                print ("----\nYou selected this as a result field.\nPlease specify the isotope in II-### or II or String Format\ne.g. U-235 , Th , or U early.\n")
                isotope = input("Isotope : ")
                print ("----")
                temp = "R=" + isotope

            if temp == 19:
                temp = "U"

            if not temp == -1:
                map_data.append(temp)
                j = j + 1
                #This line is so that if temp = U, we don't run into any errors comparing it in the while statement
                #I picked 10 for no other reason than that it passed, which is ok, because any non-pass runthroughs of the while loop will not get here
                temp = 1

    print("-------------------------------------\n\nThis is the resulting map:\n\n")
    format_json_to_screen(map_to_formatted_record(map_data,record))
    print("\n\n-------------------------------------\n\n")
    print("A copy of the above has been put into [CSV Filename]Test.json for review.")

    outfilename = sys.argv[2][:len(sys.argv[2])-4] + "Test.json"
    format_json_to_output_doc(outfilename, map_to_formatted_record(map_data,record))

    outfilename = sys.argv[2][:len(sys.argv[2])-4]+".map"
    out         = codecs.open(outfilename,'w','utf-8')
    j = 0
    for i in map_data:
        if not j == 0:
            out.write(" ")
        out.write(repr(i))
        j = j + 1
    out.close()

# .............................................................................
def map_to_formatted_record(map_data, in_record):
    j = 0
    units = ""
    ResultsIsotope = []
    ResultsValue = []
    out_record = ["","","","","","","","","","","","","","","","","","","",""]
    for i in in_record:
        if map_data[j] == "U":
            units = i
        elif str(map_data[j])[0] == "R":
            ResultsIsotope.append(map_data[j][2:])
            ResultsValue.append(i)
        else:
            out_record[map_data[j]-1] = i
        j = j + 1
    #Formatting from the Bash Script (Still Good Here!!)
    #"results\" :\n\t\t[$RESULTS1,\n\t\t$RESULTS2,\n\t\t$RESULTS3,\n\t\t$RESULTS4,\n\t\t$RESULTS5,\n\t\t$RESULTS6,\n\t\t$RESULTS7,\n\t\t$RESULTS8,\n\t\t$RESULTS9,\n\t\t$RESULTS10,\n\t\t$RESULTS11]\n\t},
    #RESULTS1="{\"isotope\" : \"$ISOTOPE1\", \"type\" : \"$TYPE1\", \"value\" : [ $VALUE1],\"unit\":\"$UNIT\"}"
    ResultField = "["
    j = 0
    oneResult = ""
    for i in ResultsValue:
        if not i == "":
            if not ResultField == "[":
                ResultField = ResultField+ ",\n\t\t"
            if ("<" in ResultsValue[j]):
                ResultType = "limit"
                value= ResultsValue[j].replace("<", "").replace(" ","")
                if ("(" in ResultsValue[j]):
                    a = ResultsValue[j].index('(')
                    value = value+","+ResultsValue[j][a+1:].replace(")", "").replace(" ","")
            else:
                ResultType = "measurement"
                if ("(" in ResultsValue[j]):
                    a = ResultsValue[j].index('(')
                    value = ResultsValue[j][:a].replace(" ","")+","+ ResultsValue[j][a+1:].replace("(", "").replace(")", "").replace(" ","")
                else:
                    value = ResultsValue[j]
            if re.search(r'[^.0-9,]', value):
                value = "\"" + value + "\""
            oneResult ="{\"isotope\" : \"" + ResultsIsotope[j] + "\", \"type\" : \""+ResultType+"\", \"value\" : ["+value+"],\"unit\":\""+units+"\"}"
            ResultField=ResultField+oneResult
        j = j + 1
    ResultField = ResultField+"]"
    out_record[16] = ResultField
    return out_record

# .............................................................................
# Puts a complete record to the screen
def format_json_to_screen(record=["","","","","","","","","","","","","","","","","","","",""]):
    now = datetime.datetime.now()
    #The following lines, while ugly, tell you in which order each data field should be in a record
    EXPERIMENTNAME, SAMPLENAME, SAMPLEDESCRIPTION=record[0],record[1],record[2]
    IDNUMBER,SAMPLESOURCE,OWNERNAME,OWNERCONTACT,MEASUREMENTINSTITUTION,MEASUREMENTTECHNIQUE= record[3],record[4],record[5],record[6],record[7],record[8]
    STARTDATE,ENDDATE,REQUESTORNAME,REQUESTORCONTACT,PRACTITIONERNAME,PRACTITIONERCONTACT=record[9],record[10],record[11],record[12],record[13],record[14]
    DESCRIPTION,RESULTSLIST ,REFERENCE,INPUTNAME,INPUTCONTACT,TODAYSDATE=record[15],record[16],record[17],record[18],record[19], now.strftime("%Y-%m-%d")
    #Prints the json document to screen (fully formatted)
    print("{\n\"type\" : \"measurement\",\n\"grouping\" : \"", EXPERIMENTNAME,"\",\n\"sample\" :{\n\t\"name\":  \"",SAMPLENAME,"\",\n\t\"description\": \"",SAMPLEDESCRIPTION,"\",\n\t\"id\" : \"",IDNUMBER,"\",\n\t\"source\" : \"",SAMPLESOURCE,"\",\n\t\"owner\" :{\"name\" : \"",OWNERNAME,"\", \"contact\" : \"",OWNERCONTACT,"\"}\n\t},\n\"measurement\":{\n\t\"institution\" : \"",MEASUREMENTINSTITUTION,"\",\n\t\"technique\" : \"",MEASUREMENTTECHNIQUE,"\",\n\t\"date\" : [\"",STARTDATE,"\",\"",ENDDATE,"\"],\n\t\"requestor\":{\"name\" : \"",REQUESTORNAME,"\",\"contact\": \"",REQUESTORCONTACT,"\"},\n\t\"practitioner\":{\"name\" : \"",PRACTITIONERNAME,"\",\"contact\": \"",PRACTITIONERCONTACT,"\"},\n\t\"description\": \"",DESCRIPTION,"\",\n\t\"results\" :\n\t\t",RESULTSLIST ,"\n\t},\n\"data_source\":{\n\t\"reference\" : \"",REFERENCE,"\",\n\t\"input\":{\n\t\t\"name\":\"",INPUTNAME,"\",\n\t\t\"contact\":\"",INPUTCONTACT,"\",\n\t\t\"date\" : \"",TODAYSDATE,"\"},\n\t\"notes\" : \"Automatic Entry via importCSV.py python script. (Written by Benjamin Wise of SMU.) For more information go to radiopurity.org.\"\n\t},\n\"specification\" : \"",MADFversion,"\"\n}")

# .............................................................................
# Puts a complete record out to a file
def format_json_to_output_doc(outfilename,record=["","","","","","","","","","","","","","","","","","","",""]):
    out=codecs.open(outfilename, 'w','utf-8')
    now = datetime.datetime.now()
    #The following lines, while ugly, tell you in which order each data field should be in a record
    EXPERIMENTNAME, SAMPLENAME, SAMPLEDESCRIPTION=record[0],record[1],record[2]
    IDNUMBER,SAMPLESOURCE,OWNERNAME,OWNERCONTACT,MEASUREMENTINSTITUTION,MEASUREMENTTECHNIQUE= record[3],record[4],record[5],record[6],record[7],record[8]
    STARTDATE,ENDDATE,REQUESTORNAME,REQUESTORCONTACT,PRACTITIONERNAME,PRACTITIONERCONTACT=record[9],record[10],record[11],record[12],record[13],record[14]
    DESCRIPTION,RESULTSLIST,REFERENCE,INPUTNAME,INPUTCONTACT,TODAYSDATE=record[15],record[16],record[17],record[18],record[19], now.strftime("%Y-%m-%d")
    #Prints the json document to the file (fully formatted). writelines only accepts a sequence (list) so this is the easiest way to do it
    sequence=["{\n\"type\" : \"measurement\",\n\"grouping\" : \"", EXPERIMENTNAME,"\",\n\"sample\" :{\n\t\"name\":  \"",SAMPLENAME,"\",\n\t\"description\": \"",SAMPLEDESCRIPTION,"\",\n\t\"id\" : \"",IDNUMBER,"\",\n\t\"source\" : \"",SAMPLESOURCE,"\",\n\t\"owner\" :{\"name\" : \"",OWNERNAME,"\", \"contact\" : \"",OWNERCONTACT,"\"}\n\t},\n\"measurement\":{\n\t\"institution\" : \"",MEASUREMENTINSTITUTION,"\",\n\t\"technique\" : \"",MEASUREMENTTECHNIQUE,"\",\n\t\"date\" : [\"",STARTDATE,"\",\"",ENDDATE,"\"],\n\t\"requestor\":{\"name\" : \"",REQUESTORNAME,"\",\"contact\": \"",REQUESTORCONTACT,"\"},\n\t\"practitioner\":{\"name\" : \"",PRACTITIONERNAME,"\",\"contact\": \"",PRACTITIONERCONTACT,"\"},\n\t\"description\": \"",DESCRIPTION,"\",\n\t\"results\" :\n\t\t",RESULTSLIST ,"\n\t},\n\"data_source\":{\n\t\"reference\" : \"",REFERENCE,"\",\n\t\"input\":{\n\t\t\"name\":\"",INPUTNAME,"\",\n\t\t\"contact\":\"",INPUTCONTACT,"\",\n\t\t\"date\" : \"",TODAYSDATE,"\"},\n\t\"notes\" : \"Automatic Entry via importCSV.py python script. (Written by Benjamin Wise of SMU.) For more information go to radiopurity.org.\"\n\t},\n\"specification\" : \"",MADFversion,"\"\n}"]
    out.writelines(sequence)

# .............................................................................
# Executes the import and conversion of the .csv file
def MADF_import():
    print("< csv_import > subroutine called:")
    print("\nBeginning import of" + sys.argv[3] + "using map file" + sys.argv[2] + ".\n")
    map_data = []
    for i in read_map(sys.argv[2])[0]:
        temp=i.replace("'","")
        if temp[0]=="R" or temp[0]=="U":
            map_data.append(temp)
        else:
            temp=int(temp)
            map_data.append(temp)
    print("Map file has been read in successfully.")
    data = read_csv(sys.argv[3])
    print("CSV file has been read in successfully.")
    print("\nAdditional Information Required!")
    inputName = input("Please enter your name: ")
    inputContact = input("Please enter your contact information (Institution or email/postal address) : ")
    print("\nOptional: You can override the previously mapped (or perhaps unmapped) data source field no.\nDo you want to do so?")
    overrideReference = input("y or n (any other input will be interpreted as no) ? ")
    if ("y" in overrideReference) or ("Y" in overrideReference):
            reference = input("Please input data source information : ")
    print("\n-----------------------------------\nBegin Importing to JSON Format.\n")
    j = 0
    count = 0
    for record in data:
        importFile = 0 #if 0 (false) record is empty, therefore do not write a json document for it
        for i in record:
            if not i == "":
                importFile = 1
        if importFile:
            j = j + 1
            record = map_to_formatted_record(map_data,record)
            record[18] = inputName
            record[19] = inputContact
            if ("y" in overrideReference) or ("Y" in overrideReference):
                record[17]=reference
            outfilename=sys.argv[3][:len(sys.argv[3])-4]+repr(j)+".json"
            format_json_to_output_doc(outfilename,record)
            count = count + 1
    print("\nDone.\n",count," JSON documents created.\n-----------------------------------")

# .............................................................................
#Prints a Help Menu
def help():
    print("< help > subroutine called:")
    print("\nWelcome to " + name)
    print("This script imports .csv files to Material Assay Data Format v." + MADFversion )
    print("\nUsage: python" + name + "[-m | -i |-h] [[import file name].map]\n[[import file name].csv]")
    print("\n\nOptions:\n")
    print("-h : Display this help message.\n")
    print("-m : Create map for .csv file.")
    print("         Will allow you to import specific columns of the csv file")
    print("         into the fields of the MADF format.")
    print("         Creates [import file name].map file for later use.")
    print("         Useage: python" + name + "-m [import file name].csv\n")
    print("-i : Imports the entire .csv file into MADF format.")
    print("         Creates [import file name].X.txt files for each of X records\n  in [import file name].csv")
    print("         Usage: python" + name + "-i [import file name].map\n      [import file name].csv\n")
    print("-c : Allows you to concatenate results columns, when \"<\" and value or value and error are in separate columns.")
    print("         Useage: python" + name + "-c [import file name].csv\n")
    print("-e : Prints Error Codes/Exit Status Definitions.\n")

# .............................................................................
# Calls the different subroutines based on which arguments are passed
def main():
    #print (sys.getdefaultencoding())
    print ("Note: Some fields, such as dates are not formatted by this program and thus will appear exactly as they were in the original document.\n----------\n")
    if len(sys.argv) > 1 :
        if sys.argv[1] == "-h":
            help()
        elif sys.argv[1] == "-i":
            if len(sys.argv) == 4:
                MADF_import()
            else:
                help()
                print ("\n*******\nERROR:\nIncorrect number of Arguments.\n*******\n")
                print ("Exit Status: 2")
                sys.exit(2)
        elif sys.argv[1] == "-e":
            error_definitions()
        elif sys.argv[1] == "-m":
            if len(sys.argv) == 3:
                map()
            else:
                help()
                print ("\n*******\nERROR:\nNo .csv File Specified or Incorrect number of Arguments.\n*******\n")
                print ("Exit Status: 2")
                sys.exit(2)
        elif sys.argv[1] == "-c":
            if len(sys.argv) == 3:
                column_concatenate()
            else:
                help()
                print ("\n*******\nERROR:\nNo .csv File Specified or Incorrect number of Arguments.\n*******\n")
                print ("Exit Status: 2")
                sys.exit(2)
        else:
            help()
            print("\n*******\nERROR:\nUnknown or incorrect argument. Could not parse <", sys.argv[1], ">. \nPlease try again.\n*******\n")
            print ("Exit Status: 2")
            sys.exit(2)
    else:
        help()
        print("\n*******\nERROR\nNo argument specified.\nPlease try again.\n*******\n")
        print ("Exit Status: 2")
        sys.exit(2)

# .............................................................................
def column_concatenate():
    print("< column_concatenate > subroutine called:")
    data = read_csv(sys.argv[2])
    newformat=[""]
    j = 0
    temp = ""
    for i in data[0]:
        concat = 0
        errorCol = 0
        if not j == 0:
            print("---------------------")
            print("Do you want to concatenate \"" + temp + "\" and \"" + i + "\"? (Answer y or Y to concatenate)")
            if input().lower() == 'y':
                concat = 1
                print("Is the latter a field that denotes a symmetric error? (Answer y or Y)")
                if input().lower() == 'y':
                    errorCol = 1
            if concat:
                if errorCol:
                    newformat.append("e")
                else:
                    newformat.append("c")
            else:
                newformat.append("")
        temp = i
        j = j + 1
    #for i in newformat:
                    #print (i, "|", end="")
    newdata=[]
    for record in data:
        j = 0
        temprecord = []
        tempfield = ""
        for i in record:
            if j == 0:
                tempfield = i
            else:
                if newformat[j] == "e":
                    if not i.lower() == "null":
                        tempfield = tempfield + "(" + i + ")"
                elif newformat[j] == "c":
                    tempfield = tempfield + i
                else:
                    temprecord.append(tempfield)
                    tempfield = i
            j = j + 1
    temprecord.append(tempfield)
    newdata.append(temprecord)

    outfilename = sys.argv[2][:len(sys.argv[2])-4]+"Concatenated.csv"
    with open(outfilename, 'w', newline='',encoding='utf-8') as f:
        writer = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL )
        #for a in newdata:
        writer.writerows(newdata)

# .............................................................................
# Allows execution as a script or as a module
if __name__ == '__main__':
        main()
