function (doc) {
	if(doc.type == "measurement" && doc.grouping && doc.sample.name){
		emit([doc.grouping,doc.sample.name],doc);
	}
};