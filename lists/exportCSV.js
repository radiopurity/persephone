/*
============
exportCSV.js
============
--------------------------------------------------------------------------
Name:           exportCSV.js
Purpose:        To export the measurement result in CSVin the search-tab.

Author:         Zheng Li
Email:          Ronnie.alonso@gmail.com

Created:        18 July 2013
Copyright:      (c) Zheng Li 2013
--------------------------------------------------------------------------
*/
function(doc, req) {
	provides("csv", function() {
		var csv = "";

		csv += "type,grouping,sample-name,sample-description,sample-id,sample-source,sample-owner-name,sample-owner-contact,";
		csv += "measurement-institution,measurement-technique,measurement-date,measurement-requestor-name,measurement-requestor-contact,measurement-practitioner-name,measurement-practitioner-contact,measurement-description,";
		csv += "isotope,type,value,unit,";
		csv += "reference,input-name,input-contact,input-date,notes\n";

		while (row = getRow()) {
			var idlist = JSON.parse(req.query.idlist);
			for(var k in idlist){
				if(row.key == idlist[k]){
					var str1="", str2="";
					str1 += row.value.type + ",\""+ row.value.grouping + "\",\""+ 
						row.value.sample.name + "\",\""+ row.value.sample.description + "\",\""+ 
						row.value.sample.id + "\",\""+ row.value.sample.source + "\",\""+ 
						row.value.sample.owner.name + "\",\""+ row.value.sample.owner.contact + "\",";
	
					// measurement
					str1 += "\""+row.value.measurement.institution + "\",\""+ row.value.measurement.technique + "\","+ 
							row.value.measurement.date + ",\""+ row.value.measurement.requestor.name + "\",\""+
							row.value.measurement.requestor.contact + "\",\""+ row.value.measurement.practitioner.name + "\",\""+
							row.value.measurement.practitioner.contact + "\",\""+ row.value.measurement.description + "\",";
	
					// data source				
					str2 += "\""+row.value.data_source.reference +"\",\""+
							row.value.data_source.input.name +"\",\""+
							row.value.data_source.input.contact +"\",\""+
							row.value.data_source.input.date +"\",\" "+
							row.value.data_source.notes +"\",";
					// measurement result
					for (var item in row.value.measurement.results){
	
						var result_val="" , tmp_str;
						for(var i=0 ; i < row.value.measurement.results[item].value.length ;i++)
						{
							if(i == row.value.measurement.results[item].value.length - 1 ){
								result_val+=row.value.measurement.results[item].value[i]
							}
							else{
								result_val+=row.value.measurement.results[item].value[i]+",";
							}
						}
	
	
						tmp_str = row.value.measurement.results[item].isotope +"," +
								row.value.measurement.results[item].type +",\"[" + 
								result_val+	"]\"," + 
								row.value.measurement.results[item].unit +",";
						
						csv += str1 + tmp_str +str2 + "\n";
					}
					csv += "\n";
				}
			}
		}
		return csv;
	});
}