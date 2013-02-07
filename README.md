
About
-----

Persephone is a database system for storing material radio-purity data.

It was originally developed by James Loach at LBNL (james.loach@gmail.com).

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

