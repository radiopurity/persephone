/*
============
exportXML.js
============
--------------------------------------------------------------------------
Name:           exportXML.js
Purpose:        To export the measurement result in XML in the search-tab.

Author:         Zheng Li
Email:          Ronnie.alonso@gmail.com

Created:        13 July 2013
Copyright:      (c) Zheng Li 2013
--------------------------------------------------------------------------
*/
function(doc, req) {
	provides("xml", function() {
		var html = "<assay>\n";
		while (row = getRow()) {
			if(row.key == req.query._id){
				html += "<_id>" + row.key + "</_id>\n"+
						"<type>" + row.value.type + "</type>\n" +
						"<group>" + row.value.grouping + "</group>\n" +
						"<sample>\n"+
							"<name>" + row.value.sample.name + "</name>\n" +
							"<description>" + row.value.sample.description +"</description>\n" +
							"<id>" + row.value.sample.id + "</id>\n"+
							"<source>"+ row.value.sample.source + "</source>\n" +
							"<owner>\n"+
								"<name>" + row.value.sample.owner.name + "</name>\n" +
								"<contact>" + row.value.sample.owner.contact + "</contact>\n" +
							"</owner>\n"+
						"</sample>\n" +
						"<measurement>\n"+
							"<institution>" + row.value.measurement.institution + "</institution>\n" +
							"<technique>" +row.value.measurement.technique + "</technique>\n"+
							"<date>" + row.value.measurement.date + "</date>\n" +
							"<requestor>\n" +
								"<name>" + row.value.measurement.requestor.name + "</name>\n" +
								"<contact>" + row.value.measurement.requestor.contact + "</contact>\n" + 
							"</requestor>\n" +
							"<practitioner>\n" +
								"<name>" + row.value.measurement.practitioner.name + "</name>\n" +
								"<contact>" + row.value.measurement.practitioner.contact + "</contact>\n" + 
							"</practitioner>\n" +
							"<description>" + row.value.measurement.description +"</description>\n" +
							"<results>\n";
				for (item in row.value.measurement.results){
					html += "<isotope>"+ row.value.measurement.results[item].isotope +"</isotope>\n" +
							"<type>"+ row.value.measurement.results[item].type +"</type>\n" +
							"<value>"+ row.value.measurement.results[item].value +"</value>\n" +
							"<unit>"+ row.value.measurement.results[item].unit +"</unit>\n";
				}
				html += "</results>\n" +
						"</measurement>\n"+
						"<data_source>\n" +
							"<reference>" + row.value.data_source.reference + "</reference>\n"+
							"<input>\n" +
								"<name>" + row.value.data_source.input.name + "</name>\n" +
								"<contact>" + row.value.data_source.input.contact + "</contact>\n" +
								"<date>" + row.value.data_source.input.date +"</date\n>" +
							"</input>\n"+
							"<notes>" + row.value.data_source.notes + "</notes>\n"+
						"</data_source>\n";
			}
		}
		html += "</assay>";
		return html;
	});
}