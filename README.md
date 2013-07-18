
About
-----

Persephone is a database system for storing material radio-purity data.
It is based on a system developed by James Loach at LBNL.

Main contributors to the code:

   James Loach (james.loach@gmail.com)
   Adam Cox (gadamc@gmail.com)
   Khang Nguyen (photonfactor@gmail.com)
   Zheng Li (ronnie.alonso@gmail.com)
   Ben Wise (bwise@mail.smu.edu)

Installation
------------

Persephone is a couchapp (http://couchapp.org/).

For installation you will need to have couchapp installed and have access to a couchdb.

This is how to install on a local version of couchdb:

  - clone the application into a directory 'persephone'
  - create a couchdb called `[NAME]`
  - send persephone to `[NAME]` using the couchapp tool:

         couchapp push persephone http://127.0.0.1:5984/[NAME]

  - if sucessful you'll receive a URL to your application

Community database
------------------

Available at http://www.radiopurity.org

