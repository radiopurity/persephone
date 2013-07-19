function(doc, req) {
	provides("csv", function() {
		var str1="", str2="", csv = "";

		while (row = getRow()) {
			if(row.key == req.query._id){

				str1 += "type,grouping,sample-name,sample-description,sample-id,sample-source,sample-owner-name,sample-owner-contact,";
				str2 += row.value.type + ",\""+ row.value.grouping + "\",\""+ 
					row.value.sample.name + "\",\""+ row.value.sample.description + "\",\""+ 
					row.value.sample.id + "\",\""+ row.value.sample.source + "\",\""+ 
					row.value.sample.owner.name + "\",\""+ row.value.sample.owner.contact + "\",";

				// measurement
				str1 += "measurement-institution,measurement-technique,measurement-date,measurement-requestor-name,measurement-requestor-contact,measurement-practitioner-name,measurement-practitioner-contact,measurement-description,";
				str2 += "\""+row.value.measurement.institution + "\",\""+ row.value.measurement.technique + "\","+ 
						row.value.measurement.date + ",\""+ row.value.measurement.requestor.name + "\",\""+
						row.value.measurement.requestor.contact + "\",\""+ row.value.measurement.practitioner.name + "\",\""+
						row.value.measurement.practitioner.contact + "\",\""+ row.value.measurement.description + "\",";

				// measurement result
				for (var item in row.value.measurement.results){
					str1 += "isotope,type,value,unit,";

					var result_val="";
					for(var i=0 ; i < row.value.measurement.results[item].value.length ;i++)
						result_val+=row.value.measurement.results[item].value[i]+" ";

					str2 += row.value.measurement.results[item].isotope +"," +
							row.value.measurement.results[item].type +",\"" + 
							result_val+	"\"," + 
							row.value.measurement.results[item].unit +",";
				}

				// data source
				str1 += "reference,input-name,input-contact,input-date,notes";
				str2 += "\""+row.value.data_source.reference +"\",\""+
						row.value.data_source.input.name +"\",\""+
						row.value.data_source.input.contact +"\",\""+
						row.value.data_source.input.date +"\",\" "+
						row.value.data_source.notes +"\",";

				// user
				for (var i in row.value.user){
					str1 += "user-name,user-description,user-type,user-value,";
					str2 += row.value.user[i].isotope +",\"" +
							row.value.user[i].description +"\",\"";
							row.value.user[i].type +"\"," +
							row.value.user[i].value +",";
				}

				csv += str1 + "\n" +str2 + "\n";
			}
		}
		return csv;
	});
}