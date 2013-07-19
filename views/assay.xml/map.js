/*
============
map.js
============
--------------------------------------------------------------------------
Name:           map.js
Purpose:        CouchDB map function.

Author:         Zheng Li
Email:          Ronnie.alonso@gmail.com

Created:        13 July 2013
Copyright:      (c) Zheng Li 2013
--------------------------------------------------------------------------
*/
function (doc) {
	if(doc.type == "measurement" && doc._id){
		emit(doc._id,doc);
	}
};