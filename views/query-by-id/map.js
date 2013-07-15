function (doc) {
	if(doc.type == "measurement" && doc._id){
		emit(doc._id,doc);
	}
};