#!/usr/bin/python

# ============
# unitTools.py
# ============
#
#    DESCRIPTION
#
#    USAGE
#    
#    OPTIONS
#
#             ==================
#    Based on RadioConversion.py by Ben Wise.
#             ==================
#
#    This code is heavily based upon an open source code developed by 
#    Ben Wise. The original file header:
#
#    -------------------------------------------------------------------------------
#    Name:           unitTools.py
#    Purpose:        To facilitate conversion between different radiological units,
#                    such as Bq/kg, g/g, ppm, ppb, ppt, etc.
#
#    Author:         Ben Wise
#    Email:          bwise@smu.edu
#
#    Created:        09 July 2013
#    Copyright:      (c) Ben Wise 2013
#    Licence:        GNU General Public License
#    Version:        1.0
#    -------------------------------------------------------------------------------

# .............................................................................
# Dictionary Containing Quality Codes
qualityCode = {
    1 : "exact conversion",
    2 : "approximate conversion",
    3 : "No Conversion / Error"
    }

# .............................................................................
# Dictionary Containing Conversion Factors:
convFactor = {

    # Standard Conversions
    ("Standard Conversions", "std") :
        {
            "ppm" : { 
                "ppb" :     ( 1,       1000.0      ),
                "ppt" :     ( 1,    1000000.0      ),
                "ppq" :     ( 1, 1000000000.0      ),
                "g/g" :     ( 1,           .000001 )
            },
            "Bq/kg" : {
                "mBq/kg"  : ( 1,       1000.0      ),
                "muBq/kg" : ( 1,    1000000.0      ),
                "uBq/kg"  : ( 1,    1000000.0      ),
                "Bq/g"    : ( 1,          0.001    ),
                "/g"      : ( 1,          0.001    ),
                "muBq/g"  : ( 1,       1000.0      ),
                "uBq/g"   : ( 1,       1000.0      ),
                "nBq/kg"  : ( 1, 1000000000.0      )
            }
        },

    # Uranium 238 Factors
    ("U-238", "U238", "238U", "238-U"):
        {
        "ppm" : {"Bq/kg": (1, 12.4366)}
        },

    # Thorium 232 Factors
    ("Th-232", "Th232", "232Th", "232-Th"):
        {
        "ppm": {"Bq/kg": (1, 4.0719)}
        },

    # Potassium 40 Factors
    ("K-40", "K40", "40K", "40-K"):
        {
        "ppm": {"Bq/kg": (1, 265.2416)}
        }

# Archetype:
#   ("IsotopeName1", "IsotopeName2") :
#       {
#       "srcUnit"  : { "destUnit" : (qualityCode, Conversion Factor), "destUnit2" : (qualityCode, Conversion Factor)},
#       "srcUnit2" : { "destUnit" : (qualityCode, Conversion Factor), "destUnit2" : (qualityCode, Conversion Factor)}
#       },
#***********
#Note: due to the non-linear nature of data-access in dictionaries, duplicate entries are an exceedingly bad idea,
#       since the program could pick either value.
#***********
    }

# .............................................................................
# Main Function, when run in command line will ask for values and run conversion
def main():
    # Fix Python 2.x
    try: raw_input = input
    except NameError: pass
    
    print("Welcome to RadioConversion.py:\n\nCurrently supported conversions are:")
    
    for isotope, val in convFactor.items():
        print(' ')
        print(isotope[0] + " :")
        for s_unit,val2 in val.items():
            for d_unit, QCfactorTuple in val2.items():
                print(s_unit.center(12) + "<-->" + d_unit.center(12) + " (" + qualityCode[QCfactorTuple[0]] + ")" )
    print ("\n\n")
    
    SIso   = raw_input("Please enter the Source Isotope (or std for Standard Conversions): ")
    SValue = float(raw_input("Please enter the value to convert : "))
    SUnit  = raw_input("Please enter the units before conversion : ")
    DUnit  = raw_input("Please enter the unit to convert to : ")
#   DIso   = raw_input("Please enter the Isotope to convert to : ")
    
    QC, val = convert(SIso, SValue, SUnit, DUnit)
    
    print("Result : " + str(val) + " " + DUnit + "\nThis is a(n)" + qualityCode[QC] + ".")

# .............................................................................
# Does the actual conversion
def convert(srcIsotope, srcValue, srcUnit,  destUnit, destIsotope = None):
    
    if destIsotope is "":
        destIsotope = srcIsotope
    
    #In case of failed conversion these will be unaltered
    intermediateQualityCode  = 0
    intermediateQualityCode2 = 0
    qualityCode              = 3
    destValue                = None
    
    intermediateUnit = ""
    
    if srcIsotope != "std":
        for k, v in convFactor.items():
            if "std" in k:
                tempDict = v
        for std_unit,val in tempDict.items():
            for nonstd_unit, val2 in val.items():
                if srcUnit == nonstd_unit:
                    intermediateUnit = std_unit
        if intermediateUnit != "":
            intermediateQualityCode, srcValue = convert("std", srcValue, srcUnit, intermediateUnit)
            srcUnit = intermediateUnit
        
        intermediateUnit = ""
        
        for k,v in convFactor.items():
            if "std" in k:
                tempDict = v
        for std_unit, val in tempDict.items():
            for nonstd_unit, val2 in val.items():
                if destUnit == nonstd_unit:
                    intermediateUnit = std_unit
        if intermediateUnit != "":
            intermediateQualityCode2, srcValue = convert("std", srcValue, intermediateUnit,  destUnit)
            destUnit = intermediateUnit
    
    if srcUnit.lower() == destUnit.lower():
        qualityCode = 1
        destValue = srcValue
    
    for sourceisotopekey, val0 in convFactor.items():
        if srcIsotope in sourceisotopekey:
            for unit1, val1 in val0.items():
                if srcUnit in unit1:
                    for unit2, QCfactorTuple in val1.items():
                        if destUnit in unit2:
                            qualityCode = QCfactorTuple[0]
                            destValue = srcValue * QCfactorTuple[1]
                elif destUnit in unit1:
                    for unit2, QCfactorTuple in val1.items():
                        if srcUnit in unit2:
                            qualityCode = QCfactorTuple[0]
                            destValue = srcValue * (1/QCfactorTuple[1])

    if intermediateQualityCode > qualityCode:
        qualityCode = intermediateQualityCode
    if intermediateQualityCode2 > qualityCode:
        qualityCode = intermediateQualityCode
    return qualityCode , destValue

# .............................................................................
def stringConvert(string, returnTuple=False):
    # Fix Python 2.x
    try: raw_input = input
    except NameError: pass
    
    import re
    warning = False
    
    string = " " + string + " "
    string = re.sub(" ", "   ", string)
    
    number = re.findall(" [^a-zA-Z\-]*?([0-9]*\.[0-9]+|[0-9]+)[^a-zA-Z\-]*? ", string)
    
    if number == []:
        print("********\nNo numerical value found. Exiting.\n********")
        raise
    
    if len(number) > 1:
        print ("********\nWarning: Too many numbers matched in string.\nPossibility of Error is VERY HIGH.\n********")
        warning=True
    
    units = []
    isotopes = []
    for k, v in convFactor.items():
        isotopes.append(k)
        for std_unit,val in v.items():
            units.append(std_unit)
            for nonstd_unit, val2 in val.items():
                units.append(nonstd_unit)
    
    temp = []
    for i in units:
        if not i in temp:
            temp.append(i)
    units = temp
    
    splitstring = re.split("[ ]", string)
    
    firstUnit  = ""
    secondUnit = ""
    
    for i in splitstring:
        for x in units:
            if i == x:
                if firstUnit == "":
                    firstUnit = x
                elif secondUnit == "":
                    secondUnit = x
                else:
                    print( "********\nWarning: Too many units matched in string.\nPossibility of Error is VERY HIGH.\n********")
                    warning = True
    
    firstIsotope  = ""
    secondIsotope = ""
    
    for i in splitstring:
        for x in isotopes:
            if i in x:
                if firstIsotope == "":
                    firstIsotope = x[0]
                elif secondIsotope == "":
                    secondIsotope = x[0]
                else:
                    print( "********\nWarning: Too many isotopes matched in string.\nPossibility of Error is VERY HIGH.\n********")
                    warning = True
    
    if secondIsotope == "":
        secondIsotope = firstIsotope
    
    print("------------\nConverting", number[0], firstUnit, "(", firstIsotope, ") to", secondUnit, "(", secondIsotope, ").\n------------")
    
    if firstUnit == "":
        print("********\nNo units matched. Exiting.\n********")
        raise
    
    if secondUnit == "":
        print("********\nNot enough units matched. Exiting.\n********")
        raise
    
    if firstIsotope == "":
        print("********\nNo isotope matched. Exiting.\n********")
        raise
    
    if warning:
        print("********\nWarning: The accuracy of the conversion is HIGHLY SUSPECT.\nPLEASE CHECK THAT THE ABOVE LINE IS CORRECT!!!\n********")
    
    QC, val = convert( firstIsotope, float(number[0]), firstUnit, secondUnit, secondIsotope)
    
    print("Result : ", val, " ", secondUnit, "\nThis is a(n)", qualityCode[QC], ".")
    
    if returnTuple:
        return QC, val

# .............................................................................
# Allows execution as a script or as a module
if __name__ == '__main__':
    main()
