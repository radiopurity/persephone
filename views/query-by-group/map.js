function (doc) {
	if(doc.type == "measurement" && doc.grouping && doc.sample.name){
		res = {
			_id: doc._id,
			type: doc.type,
			sample: {
				name: doc.sample.name,
				description: doc.sample.description
			},
			measurement: {
				results: doc.measurement.results
			},
			grouping: doc.grouping
		};
		emit([doc.grouping,doc.sample.name],res);
	}
};