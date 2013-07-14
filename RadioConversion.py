#-------------------------------------------------------------------------------
# Name:		RadioConversion.py
# Purpose:	To facilitate conversion between different radiological units, such 
#			as Bq/kg, g/g, ppm, ppb, ppt, etc.
#
# Author:	  Ben Wise
# Email:	   bwise@smu.edu
#
# Created:	 09 July 2013
# Copyright:   (c) Ben Wise 2013
# Licence:	 GNU General Public License
# Version:	 1.0
#-------------------------------------------------------------------------------

#Dictionary Containing Quality Codes
qualitycode={
	1 : "exact conversion",
	2 : "approximate conversion",
	3 : "No Conversion / Error"
	}

#Dictionary Containing Conversion Factors:
conversionfactor={

	#Standard Conversions
	("Standard Conversions", "std") :
		{
		"ppm" : { 
					"ppb" : (1, 1000.0),
					"ppt" : (1, 1000000.0),
					"ppq":(1, 1000000000.0),
					"g/g":(1,.000001)
				},
		"Bq/kg" : {
					"mBq/kg" : (1,1000.0),
					"muBq/kg" : (1,1000000.0),
					"uBq/kg" : (1,1000000.0),
					"Bq/g" : (1,0.001),
					"/g" : (1,0.001),
					"muBq/g" : (1,1000.0),
					"uBq/g" : (1,1000.0),
					"nBq/kg" : (1,1000000000.0)
					}
		},

	#Uranium 238 Factors
	("U-238", "U238", "238U", "238-U"):
		{
		"ppm" : {"Bq/kg": (1,12.4366)}
		},

	#Thorium 232 Factors
	("Th-232", "Th232", "232Th", "232-Th"):
		{
		"ppm": {"Bq/kg": (1,4.0719)}
		},

	#Potassium 40 Factors
	("K-40", "K40", "40K", "40-K"):
		{
		"ppm": {"Bq/kg": (1,265.2416)}
		}

#Archetype:
#	("IsotopeName1", "IsotopeName2") :
#		{
#		"SourceUnit" : { "DestinationUnit" : (QualityCode, Conversion Factor), "DestinationUnit2" : (QualityCode, Conversion Factor)},
#		"SourceUnit2" : { "DestinationUnit" : (QualityCode, Conversion Factor), "DestinationUnit2" : (QualityCode, Conversion Factor)}
#		},
#***********
#Note: due to the non-linear nature of data-access in dictionaries, duplicate entries are an exceedingly bad idea,
#		since the program could pick either value.
#***********
	}

#Main Function, when run in command line will ask for values and run conversion
def main():
	print("Welcome to RadioConversion.py:\n\nCurrently supported conversions are:")
	
	for isotope, val in conversionfactor.items():
		print()
		print( isotope[0], " :")
		for s_unit,val2 in val.items():
			for d_unit, QC_Factor_Tuple in val2.items():
				print( s_unit.center(12) , "<-->" , d_unit.center(12), " (",qualitycode[QC_Factor_Tuple[0]], ")" )
	print ("\n\n")
	
	SIso=input("Please enter the Source Isotope (or std for Standard Conversions): ")
	SValue=float(input("Please enter the value to convert : "))
	SUnit=input("Please enter the units before conversion : ")
	DUnit=input("Please enter the unit to convert to : ")
#	DIso=input("Please enter the Isotope to convert to : ")
	
	QC, val = convert( SIso, SValue, SUnit, DUnit)
	
	print("Result : ", val, " ", DUnit, "\nThis is a(n)", qualitycode[QC], ".")

#Does the actual conversion
def convert(SourceIsotope, SourceValue, SourceUnit,  DestinationUnit, DestinationIsotope=None):

	if DestinationIsotope is "":
		DestinationIsotope=SourceIsotope
	
	#In case of failed conversion these will be unaltered
	IntermediateQualityCode=0
	IntermediateQualityCode2=0
	QualityCode=3
	DestinationValue=None
	
	IntermediateUnit=""
	
	if SourceIsotope != "std":
		for k,v in conversionfactor.items():
			if "std" in k:
				tempdict=v
		for std_unit,val in tempdict.items():
			for nonstd_unit, val2 in val.items():
				if SourceUnit == nonstd_unit:
					IntermediateUnit=std_unit
		if IntermediateUnit != "":
			IntermediateQualityCode, SourceValue = convert("std",  SourceValue,SourceUnit, IntermediateUnit)
			SourceUnit=IntermediateUnit
		
		#print(SourceUnit,IntermediateUnit, DestinationUnit)
		
		IntermediateUnit=""
		
		for k,v in conversionfactor.items():
			if "std" in k:
				tempdict=v
		for std_unit,val in tempdict.items():
			for nonstd_unit, val2 in val.items():
				if DestinationUnit == nonstd_unit:
					IntermediateUnit=std_unit
		if IntermediateUnit != "":
			IntermediateQualityCode2, SourceValue = convert("std", SourceValue,IntermediateUnit,  DestinationUnit)
			DestinationUnit=IntermediateUnit
			
		#print(SourceUnit,IntermediateUnit, DestinationUnit)
	
	if SourceUnit.lower()==DestinationUnit.lower():
		QualityCode=1
		DestinationValue=SourceValue
	
	for sourceisotopekey, val0 in conversionfactor.items():
		if SourceIsotope in sourceisotopekey:
			#print ("Source")
			for unit1, val1 in val0.items():
				if SourceUnit in unit1:
					#print("SU")
					for unit2, QC_Factor_Tuple in val1.items():
						if DestinationUnit in unit2:
							#print("DU2")
							QualityCode= QC_Factor_Tuple[0]
							DestinationValue = SourceValue * QC_Factor_Tuple[1]
				elif DestinationUnit in unit1:
					#print("DU")
					for unit2, QC_Factor_Tuple in val1.items():
						if SourceUnit in unit2:
							#print("SU2")
							QualityCode= QC_Factor_Tuple[0]
							DestinationValue = SourceValue * (1/QC_Factor_Tuple[1])

	if IntermediateQualityCode > QualityCode:
		QualityCode=IntermediateQualityCode
	if IntermediateQualityCode2 > QualityCode:
		QualityCode=IntermediateQualityCode
	return QualityCode , DestinationValue

def stringconvert( string, returnTuple=False):
	import re
	warning = False
	
	string = " " + string + " "
	string = re.sub(" ", "   ", string)
	
	number=re.findall(" [^a-zA-Z\-]*?([0-9]*\.[0-9]+|[0-9]+)[^a-zA-Z\-]*? ", string)
	
	if number ==[]:
		print("********\nNo numerical value found. Exiting.\n********")
		raise
	
	if len(number)>1:
		print ("********\nWarning: Too many numbers matched in string.\nPossibility of Error is VERY HIGH.\n********")
		warning=True
	
	#print (number)
	
	units =[]
	isotopes =[]
	for k,v in conversionfactor.items():
		isotopes.append(k)
		for std_unit,val in v.items():
			units.append(std_unit)
			for nonstd_unit, val2 in val.items():
				units.append(nonstd_unit)
	
	temp=[]
	for i in units:
		if not i in temp:
			temp.append(i)
	units=temp
	
	splitstring=re.split("[ ]", string)
	
	#print(splitstring)
	#print (units)
	#print (isotopes)
	
	first_unit=""
	second_unit=""
	
	for i in splitstring:
		for x in units:
			if i==x:
				if first_unit=="":
					first_unit=x
				elif second_unit=="":
					second_unit=x
				else:
					print( "********\nWarning: Too many units matched in string.\nPossibility of Error is VERY HIGH.\n********")
					warning = True
	
	first_isotope=""
	second_isotope=""
	
	for i in splitstring:
		for x in isotopes:
			if i in x:
				if first_isotope=="":
					first_isotope=x[0]
				elif second_isotope=="":
					second_isotope=x[0]
				else:
					print( "********\nWarning: Too many isotopes matched in string.\nPossibility of Error is VERY HIGH.\n********")
					warning = True
	
	if second_isotope=="":
		second_isotope=first_isotope
	
	print("------------\nConverting", number[0], first_unit, "(", first_isotope, ") to", second_unit, "(", second_isotope, ").\n------------")
	
	if first_unit=="":
		print("********\nNo units matched. Exiting.\n********")
		raise
	
	if second_unit=="":
		print("********\nNot enough units matched. Exiting.\n********")
		raise
	
	if first_isotope=="":
		print("********\nNo isotope matched. Exiting.\n********")
		raise
	
	if warning:
		print("********\nWarning: The accuracy of the conversion is HIGHLY SUSPECT.\nPLEASE CHECK THAT THE ABOVE LINE IS CORRECT!!!\n********")
	
	QC, val = convert( first_isotope, float(number[0]), first_unit, second_unit, second_isotope)
	
	print("Result : ", val, " ", second_unit, "\nThis is a(n)", qualitycode[QC], ".")
	
	if returnTuple:
		return QC, val

#Allows execution as a script or as a module
if __name__ == '__main__':
	main()