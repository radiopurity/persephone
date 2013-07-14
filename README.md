 +-+-+-+-+-+-+-+-+-+-+
 |R|a|d|i|o|T|o|o|l|s|
 +-+-+-+-+-+-+-+-+-+-+
 
README
	RadioTools.py imports .csv files, that contain radio-data of some type,to Material Assay Data Format v. 2.01, used by radiopurity.org.
	RadioDBTools.py uploads and downloads files to and from a CouchDB instance of your choice. It also allows you to delete all files of 
					type "measurement" from a particular database.

REQUIREMENTS & DEPENDENCIES
	Requires Python 3.3 or Greater
	
	Requires Requests 1.2.3 or Greater for Database Interaction (RadioDBTools.py)
		See http://docs.python-requests.org/en/latest/
		Tip: Download tarball or zipball from GitHub Repo
			 Then use $ python setup.py install
	
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
	> python RadioTools.py [Options] [[import file name].map][[import file name].csv]

	Options:
	-h : Display this help message.
	-m : Create map for .csv file.
		Will allow you to import specific columns of the csv file
		into the fields of the MADF format.
		Creates [import file name].map file for later use.
		Useage: python RadioTools.py -m [import file name].csv
	-i : Imports the entire .csv file into MADF format.
		Creates [import file name].X.txt files for each of X records
		in [import file name].csv
		Usage: python RadioTools.py -i [import file name].map
		[import file name].csv
	-c : Allows you to concatenate results columns, when "<" and value or value and
		error are in separate columns.
		Useage: python RadioTools.py -c [import file name].csv
	-e : Prints Error Codes/Exit Status Definitions.


	> python RadioDBTools.py [Options]

	Options:
	-u : Uploads .json files to a couchdb instance of your choice.
		Useage: python RadioDBTools.py -u.
	-d : Downloads .json files from a couchdb instance of your choice.
		Useage: python RadioDBTools.py -d.
	-p : Prunes (Deletes) all files of type "measurement" from a couchdb instance of
		 your choice.
		Useage: python RadioDBTools.py -p.


	For more information see radiopurity.org.


BUGS & FIXES:
	None Known. Please report any bugs to radiopurity.org or james.loach@gmail.com or bwise@smu.edu.


