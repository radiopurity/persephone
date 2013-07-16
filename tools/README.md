RadioTools
==========

 +-+-+-+-+-+-+-+-+-+-+
 |R|a|d|i|o|T|o|o|l|s|
 +-+-+-+-+-+-+-+-+-+-+
 
README
	importCSV.py imports .csv files, that contain radio-data of some type,to Material Assay Data Format v. 2.01, used by radiopurity.org.
	databaseTools.py uploads and downloads files to and from a CouchDB instance of your choice. It also allows you to delete all files of 
					type "measurement" from a particular database.
	unitTools.py converts between multiple different unit types for many different isotopes and is extensible as further data become available.
					Ex.: unitTools.py can convert 1 ppm (U-238/K-40/Th-232) to Bq/kg. To see all available units execute python unitTools.py.
	validateJSON.py checks which .json documents are valid according to the present schema.


REQUIREMENTS & DEPENDENCIES
	Requires Python 3.3 or Greater
	
	Requires Requests 1.2.3 or Greater for Database Interaction (databaseTools.py)
		See http://docs.python-requests.org/en/latest/
		Tip: Download tarball or zipball from GitHub Repo
			 Then use $ python setup.py install
	
	Requires Julian/jsonschema to validate JSON (validateJSON.py)
		See https://github.com/Julian/jsonschema
		Tip: Download via GitHub (extract if necessary)
			 Then in jsonschema main directory use 
			 $ python setup.py install 
	
	Tip: Consider downloading Notepad++ (in Windows environments) for viewing and editing .txt and .json files.
CONTACT 
	If you have problems or questions please contact radiopurity.org or james.loach@gmail.com or bwise@smu.edu.

AUTHORS
	Benjamin Wise 
	bwise@smu.edu
	(Southern Methodist University)

With help from:
	Dr. James Loach
	james.loach@gmail.com
	(Shanghai Jiaotong University)

Sponsored by:
	Dr. Jodi Cooley
	cooley@physics.smu.edu
	(Southern Methodist University)
	and 
	National Science Foundation Funding

Supporting Institutions and Collaborations:
	Karlsruhe Institute of Technology (KIT)
	Lawrence Berkeley National Laboratory (LBNL)
	LBNL Low Background Facility (LBF)
	The MAJORANA Collaboration
	Southern Methodist University (SMU)
	Shanghai Jiaotong University (SJTU)


USAGE
	> python importCSV.py [Options] [[import file name].map][[import file name].csv]

	Options:
	-h : Display this help message.
	-m : Create map for .csv file.
		Will allow you to import specific columns of the csv file
		into the fields of the MADF format.
		Creates [import file name].map file for later use.
		Useage: python importCSV.py -m [import file name].csv
	-i : Imports the entire .csv file into MADF format.
		Creates [import file name].X.txt files for each of X records
		in [import file name].csv
		Usage: python importCSV.py -i [import file name].map
		[import file name].csv
	-c : Allows you to concatenate results columns, when "<" and value or value and
		error are in separate columns.
		Useage: python importCSV.py -c [import file name].csv
	-e : Prints Error Codes/Exit Status Definitions.


	> python databaseTools.py [Options]

	Options:
	-u : Uploads .json files to a couchdb instance of your choice.
		Useage: python databaseTools.py -u [URL].
		Optional parameter URL accepts full URL's and automatically uploads all
		documents in current directory.
		Optional parameter .Extension tells program to ignore all files without a certain
		extension, i.e. .json files.(Note: The \".\" is a required character.)
	-d : Downloads .json files from a couchdb instance of your choice.
		Useage: python databaseTools.py -d [URL].
		Optional parameter URL accepts full URL's and automatically downloads all
		documents in specified database.
	-p : Prunes (Deletes) all files of type "measurement" from a couchdb instance of
		 your choice.
		Useage: python RadioDBTools.py -p.


	> python unitTools.py [STRING]
		Useage: Execute "python unitTools.py" to enter interactive mode.
		
		Alternate
		Useage: Execute "python unitTools.py" followed by some string to attempt an automatic conversion.
				Ex.: > python unitTools.py convert 12.34 ppm K-40 to mBq/kg
					 > python unitTools.py K-40 12.34 ppm mBq/kg
					 Both will attempt to convert 12.34 ppm of K-40 to mBq/kg.
					 Tip: Avoid using parentheses to enclose the isotope.


	> python validateJSON.py
		Useage: Execute "python validateJSON.py" or utilize modules in python shell.


	For more information see radiopurity.org.


BUGS & FIXES:
	None Known. Please report any bugs to radiopurity.org or james.loach@gmail.com or bwise@smu.edu.

>>>>>>> tools/master

