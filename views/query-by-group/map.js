function (doc) {
	if(doc.type == "measurement" && doc.grouping){
		emit(doc.grouping,doc);
	}
};