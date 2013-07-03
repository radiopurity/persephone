function (doc) {
	if(doc.type == "measurement" && doc.sample.name){
		emit(doc.sample.name,doc);
	}
};