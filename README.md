
# About

Persephone is a software package for storing measurements of material radiopurity. It was originally created by James Loach at LBNL.

Contributors: [James Loach](james.loach@gmail.com), Jodi Cooley, Adam Cox, Zheng Li, Khang Nguyen, Alan Poon, Benjamin Wise.

Supporting institutions and collaborations: AARM (Assay and Acquisition of Radiopure Materials), Karlsruhe Institute of Technology (KIT), Lawrence Berkeley National Laboratory (LBNL), Shanghai Jiao Tong University (SJTU), Southern Methodist University (SMU).

This work was partially supported by the National Science Foundation under Grant Number 1242640.

If you want to help develop this code, contribute your data to the community database, or use the software in your experiment or institution then please [contact us](james.loach@gmail.com).

# Usage

## Search

Example searches:

* "ofhc copper"
* copper AND ofhc
* copper OR lead
* coppe?
* cop*
* name:copper
* grouping:EXO

Searches are case-insensitive and OR by default.

To view all assays enter 'all'.

# Installation

## Overview

Persephone is a [couchapp](http://couchapp.org/). To install you will need couchapp and access to a [couchdb](http://couchdb.apache.org). For search functionality you will also need [couchdb-lucene](https://github.com/rnewson/couchdb-lucene).

## Basic installation

This is how to install on a local version of the app:

  1. Clone Persephone into a directory `persephone`
  2. Create a couchdb `[DB]` and set the permissions appropriately. Create an admin user with username `[UN]` and password `[PW]`.
  3. From the `persephone` directory send the app to the database using the couchapp tool:
  ```
    couchapp push persephone http://[UN]:[PW]@127.0.0.1:5984/[NAME]
  ```  
  4. If successful you will receive a URL to your app.
  5. Search functionality will only be available if couchdb-lucene is installed and running.

## Installation via replication

An alternative way to install the app is to replicate it from an existing installation.

# Tools

Data can be viewed and input via the user interface but it's also easy (and sometimes more inconvenient) to do these things from the command line. For example, if your raw measurements were in an Excel file, you could: export them to a .csv file, convert this file into JSON documents using a python script and then upload the documents using the python `couchdb` package.

A set of processing tools are provided in the `tools` directory for uploading data (`upload.py`), downloading data (`download.py`) and cleaning all measurements from an existing database (`prune.py`).

When uploading assays it's important to check JSON documents against the data specification (the schema in `_attachments/schema/v3.00.schema.json`). A way this can be done is illustrated in `upload.py`.

# Community database

The community-wide installation is available at [www.radiopurity.org](http://www.radiopurity.org).
