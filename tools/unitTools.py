#!/usr/bin/python

# ============
# unitTools.py
# ============
#
#    See README.md
#
#             ==================
#    Based on RadioConversion.py by Ben Wise.
#             ==================
#
#    This code is heavily based upon an open source code developed by
#    Ben Wise. The original file header:
#
#    --------------------------------------------------------------------------
#    Name:           unitTools.py
#    Purpose:        To facilitate conversion between different radiological
#                    units, such as Bq/kg, g/g, ppm, ppb, ppt, etc.
#
#    Author:         Ben Wise
#    Email:          bwise@smu.edu
#
#    Created:        09 July 2013
#    Copyright:      (c) Ben Wise 2013
#    Licence:        GNU General Public License
#    Version:        1.0
#    --------------------------------------------------------------------------

# .............................................................................
# Dictionary Containing Quality Codes
quality_code = {
    1: "exact conversion",
    2: "approximate conversion",
    3: "No Conversion / Error"
    }

# .............................................................................
# Dictionary Containing Conversion Factors:
conv_factor = {

    # Standard Conversions
    ("Standard Conversions", "std"):
        {
            "ppm": { 
                "ppb":     ( 1,       1000.0      ),
                "ppt":     ( 1,    1000000.0      ),
                "ppq":     ( 1, 1000000000.0      ),
                "g/g":     ( 1,           .000001 )
            },
            "Bq/kg": {
                "mBq/kg" : ( 1,       1000.0      ),
                "muBq/kg": ( 1,    1000000.0      ),
                "uBq/kg" : ( 1,    1000000.0      ),
                "Bq/g"   : ( 1,          0.001    ),
                "/g"     : ( 1,          0.001    ),
                "muBq/g" : ( 1,       1000.0      ),
                "uBq/g"  : ( 1,       1000.0      ),
                "nBq/kg" : ( 1, 1000000000.0      )
            }
        },

    # Uranium 238 Factors
    ("U-238", "U238", "238U", "238-U"):
        {
        "ppm": {"Bq/kg": (1, 12.4366)}
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
    #       "src_unit"  : { "dest_unit" : (quality_code, Conversion Factor),
    #                      "dest_unit2" : (quality_code, Conversion Factor)},
    #       "src_unit2" : { "dest_unit" : (quality_code, Conversion Factor),
    #                      "dest_unit2" : (quality_code, Conversion Factor)}
    #       },
    #
    # Note: due to the non-linear nature of data-access in dictionaries,
    # duplicate entries are an exceedingly bad idea, since the program
    # could pick either value.
    }


def main():
    """Main Function, when run in command line will ask
       for values and run conversion"""
    import sys
    autoConvert = False

    string = ""
    if len(sys.argv) >= 2:
        string = sys.argv[1]
#        for i in sys.argv:
#            if not i == sys.argv[0]:
#                string = string + " " + i
        try:
            print("\nAttempting to auto-convert string : \"" + 
                  string + "\"\n")
            stringConvert(string)
            print("\n\nSuccess.")
            autoConvert = True
        except:
            print("\n\n-----------\n"
                  "Failed to auto-convert string.\n"
                  "Please check that all requisite information is there.\n"
                  "Proceeding to interactive mode.\n-----------\n\n")

    if not autoConvert:
        print("Welcome to unitTools.py:\n\n"
              "Currently supported conversions are:")
        for isotope, val in conv_factor.items():
            print(' ')
            print(isotope[0] + " :")
            for s_unit, val2 in val.items():
                for d_unit, QC_factor_tuple in val2.items():
                    print(s_unit.center(12) + "<-->" +
                          d_unit.center(12) + " (" +
                          quality_code[QC_factor_tuple[0]] + ")")
        print ("\n\n")
        SIso = raw_input("Please enter the Source Isotope "
                         "(or std for Standard Conversions): ")
        SValue = float(raw_input("Please enter the value to convert : "))
        SUnit = raw_input("Please enter the units before conversion : ")
        DUnit = raw_input("Please enter the unit to convert to : ")
        #    DIso   = raw_input("Please enter the Isotope to convert to : ")
        QC, val = convert(SIso, SValue, SUnit, DUnit)
        print("Result : " + str(val) + " " + DUnit + "\n"
              "This is a(n)" + quality_code[QC] + ".")


def convert(src_isotope, src_value, src_unit, dest_unit, dest_isotope=None):
    if dest_isotope is None or dest_isotope == src_isotope:
        dest_isotope = src_isotope
    else:
        print("\n\n**********************\n"
              "\nWarning: Isotope to Isotope conversion not"
              "currently supported.\nIGNORING DESTINATION ISOTOPE.")
        print("\nContinuing with conversion: ", src_value, src_unit,
              "(", src_isotope, ") to", dest_unit,
              "\n\n**********************\n\n")

    intermediate_quality_code = 0
    iintermediate_quality_code_2 = 0
    quality_code = 3
    dest_value = None
    intermediate_unit = ""

    if src_isotope != "std":
        for k, v in conv_factor.items():
            if "std" in k:
                tempDict = v
        for std_unit, val in tempDict.items():
            for nonstd_unit, val2 in val.items():
                if src_unit == nonstd_unit:
                    intermediate_unit = std_unit
        if intermediate_unit != "":
            intermediate_quality_code, src_value \
                = convert("std", src_value, src_unit, intermediate_unit)
            src_unit = intermediate_unit

        intermediate_unit = ""

        for k, v in conv_factor.items():
            if "std" in k:
                tempDict = v
        for std_unit, val in tempDict.items():
            for nonstd_unit, val2 in val.items():
                if dest_unit == nonstd_unit:
                    intermediate_unit = std_unit
        if intermediate_unit != "":
            iintermediate_quality_code_2, src_value \
                = convert("std", src_value, intermediate_unit,  dest_unit)
            dest_unit = intermediate_unit

    if src_unit.lower() == dest_unit.lower():
        quality_code = 1
        dest_value = src_value

    for src_isotope_key, val0 in conv_factor.items():
        if src_isotope in src_isotope_key:
            for unit1, val1 in val0.items():
                if src_unit in unit1:
                    for unit2, QC_factor_tuple in val1.items():
                        if dest_unit in unit2:
                            quality_code = QC_factor_tuple[0]
                            dest_value = src_value * QC_factor_tuple[1]
                elif dest_unit in unit1:
                    for unit2, QC_factor_tuple in val1.items():
                        if src_unit in unit2:
                            quality_code = QC_factor_tuple[0]
                            dest_value = src_value * (1/QC_factor_tuple[1])

    if intermediate_quality_code > quality_code:
        quality_code = intermediate_quality_code
    if iintermediate_quality_code_2 > quality_code:
        quality_code = intermediate_quality_code

    return quality_code, dest_value


def stringConvert(string, returnTuple=False):
    try: 
        raw_input = input
    except NameError:
        pass

    import re
    warning = False

    string = " " + string + " "
    string = re.sub(" ", "   ", string)
    number = re.findall(" [^a-zA-Z\-]*?([0-9]*\.[0-9]+|[0-9]+)[^a-zA-Z\-]*? ",
                        string)
    if number == []:
        print("********\nNo numerical value found. Exiting.\n********")
        raise
    if len(number) > 1:
        print ("********\nWarning: Too many numbers matched"
               " in string.\nPossibility of Error is VERY HIGH."
               "\n********")
        warning = True

    units = []
    isotopes = []
    for k, v in conv_factor.items():
        isotopes.append(k)
        for std_unit, val in v.items():
            units.append(std_unit)
            for nonstd_unit, val2 in val.items():
                units.append(nonstd_unit)

    temp = []
    for i in units:
        if not i in temp:
            temp.append(i)
    units = temp
    split_string = re.split("[ ]", string)
    first_unit = ""
    second_unit = ""

    for i in split_string:
        for x in units:
            if i == x:
                if first_unit == "":
                    first_unit = x
                elif second_unit == "":
                    second_unit = x
                else:
                    print("********\nWarning: Too many units matched "
                          "in string.\nPossibility of Error is VERY HIGH.\n"
                          "********")
                    warning = True

    first_isotope = ""
    second_isotope = ""

    for i in split_string:
        for x in isotopes:
            if i in x:
                if first_isotope == "":
                    first_isotope = x[0]
                elif second_isotope == "":
                    second_isotope = x[0]
                else:
                    print("********\nWarning: Too many isotopes matched "
                          "in string.\nPossibility of Error is VERY HIGH.\n"
                          "********")
                    warning = True

    if second_isotope == "":
        second_isotope = first_isotope

    print("------------\nConverting " + number[0] + " " + first_unit +
          " (" + first_isotope + ") to " + second_unit +
          " (" + second_isotope + ").\n------------")

    if first_unit == "":
        print("********\nNo units matched. Exiting.\n********")
        raise
    if second_unit == "":
        print("********\nNot enough units matched. Exiting.\n********")
        raise
    if first_isotope == "":
        print("********\nNo isotope matched. Exiting.\n********")
        raise
    if warning:
        print("********\nWarning: The accuracy of the conversion "
              "is HIGHLY SUSPECT.\n"
              "PLEASE CHECK THAT THE ABOVE LINE IS CORRECT!!!\n********")

    QC, val = convert(first_isotope, float(number[0]), first_unit,
                      second_unit, second_isotope)

    print("Result : " + str(val) + " " + str(second_unit) +
          "\nThis is a(n) " + str(quality_code[QC]) + ".")

    if returnTuple:
        return QC, val


if __name__ == '__main__':
    main()
