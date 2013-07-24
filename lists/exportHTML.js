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
	provides("html", function() {
		var header = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> <head> <link rel="shortcut icon" href="images/favicon.ico" > <link rel="bookmark" href="images/favicon.ico" ><title>Result</title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <style type="text/css"> /* GitHub stylesheet for MarkdownPad (http://markdownpad.com) */ /* Author: Nicolas Hery - http://nicolashery.com */ /* Version: 29d1c5bc36da364ad5aa86946d420b7bbc54a253 */ /* Source: https://github.com/nicolahery/markdownpad-github */  /* RESET =============================================================================*/  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {   margin: 0;   padding: 0;   border: 0; }  /* BODY =============================================================================*/  body {   font-family: Helvetica, arial, freesans, clean, sans-serif;   font-size: 14px;   line-height: 1.6;   color: #333;   background-color: #fff;   padding: 20px;   max-width: 960px;   margin: 0 auto; }  body>*:first-child {   margin-top: 0 !important; }  body>*:last-child {   margin-bottom: 0 !important; }  /* BLOCKS =============================================================================*/  p, blockquote, ul, ol, dl, table, pre {   margin: 15px 0; }  /* HEADERS =============================================================================*/  h1, h2, h3, h4, h5, h6 {   margin: 20px 0 10px;   padding: 0;   font-weight: bold;   -webkit-font-smoothing: antialiased; }  h1 tt, h1 code, h2 tt, h2 code, h3 tt, h3 code, h4 tt, h4 code, h5 tt, h5 code, h6 tt, h6 code {   font-size: inherit; }  h1 {   font-size: 28px;   color: #000; }  h2 {   font-size: 24px;   border-bottom: 1px solid #ccc;   color: #000; }  h3 {   font-size: 18px; }  h4 {   font-size: 16px; }  h5 {   font-size: 14px; }  h6 {   color: #777;   font-size: 14px; }  body>h2:first-child, body>h1:first-child, body>h1:first-child+h2, body>h3:first-child, body>h4:first-child, body>h5:first-child, body>h6:first-child {   margin-top: 0;   padding-top: 0; }  a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {   margin-top: 0;   padding-top: 0; }  h1+p, h2+p, h3+p, h4+p, h5+p, h6+p {   margin-top: 10px; }  /* LINKS =============================================================================*/  a {   color: #4183C4;   text-decoration: none; }  a:hover {   text-decoration: underline; }  /* LISTS =============================================================================*/  ul, ol {   padding-left: 30px; }  ul li > :first-child,  ol li > :first-child,  ul li ul:first-of-type,  ol li ol:first-of-type,  ul li ol:first-of-type,  ol li ul:first-of-type {   margin-top: 0px; }  ul ul, ul ol, ol ol, ol ul {   margin-bottom: 0; }  dl {   padding: 0; }  dl dt {   font-size: 14px;   font-weight: bold;   font-style: italic;   padding: 0;   margin: 15px 0 5px; }  dl dt:first-child {   padding: 0; }  dl dt>:first-child {   margin-top: 0px; }  dl dt>:last-child {   margin-bottom: 0px; }  dl dd {   margin: 0 0 15px;   padding: 0 15px; }  dl dd>:first-child {   margin-top: 0px; }  dl dd>:last-child {   margin-bottom: 0px; }  /* CODE =============================================================================*/  pre, code, tt {   font-size: 12px;   font-family: Consolas, "Liberation Mono", Courier, monospace; }  code, tt {   margin: 0 0px;   padding: 0px 0px;   white-space: nowrap;   border: 1px solid #eaeaea;   background-color: #f8f8f8;   border-radius: 3px; }  pre>code {   margin: 0;   padding: 0;   white-space: pre;   border: none;   background: transparent; }  pre {   background-color: #f8f8f8;   border: 1px solid #ccc;   font-size: 13px;   line-height: 19px;   overflow: auto;   padding: 6px 10px;   border-radius: 3px; }  pre code, pre tt {   background-color: transparent;   border: none; }  /* QUOTES =============================================================================*/  blockquote {   border-left: 4px solid #DDD;   padding: 0 15px;   color: #777; }  blockquote>:first-child {   margin-top: 0px; }  blockquote>:last-child {   margin-bottom: 0px; }  /* HORIZONTAL RULES =============================================================================*/  hr {   clear: both;   margin: 15px 0;   height: 0px;   overflow: hidden;   border: none;   background: transparent;   border-bottom: 4px solid #ddd;   padding: 0; }  /* TABLES =============================================================================*/  table th {   font-weight: bold; }  table th, table td {   border: 1px solid #ccc;   padding: 6px 13px; }  table tr {   border-top: 1px solid #ccc;   background-color: #fff; }  table tr:nth-child(2n) {   background-color: #f8f8f8; }  /* IMAGES =============================================================================*/  img {   max-width: 100% } </style> </head>';
		while (row = getRow()) {
			if(row.key == req.query._id){
				var body = "<body> <h1>Result</h1> <hr /> ";
				body += "<p><strong>Group  </strong>" + row.value.grouping +"</p>";
				body += "<p><strong>Sample</strong></p> <ul>" + 
							"<li><strong>Name</strong>  " + row.value.sample.name + "</li>\n" +
							"<li><strong>Description</strong>  " + row.value.sample.description +"</li>\n";
				if(row.value.sample.id){
					body += "<li><strong>ID</strong>  " + row.value.sample.id + "</li>";
				}
				if(row.value.sample.source){
					body += "<li><strong>Source</strong>  "+ row.value.sample.source + "</li>";
				}
				
				if(row.value.sample.owner.name && row.value.sample.owner.contact){
					body += "<li><strong>Owner</strong><ul>\n"+
								"<li><strong>Name</strong>  " + row.value.sample.owner.name + "</li>\n" +
								"<li><strong>Contact</strong>  " + row.value.sample.owner.contact + "</li>\n" +
							"</ul></li>";
				}
				body += "</ul>\n" ;
				
				body +=	"<p><strong>Measurement</strong></p> <ul>";
				if( row.value.measurement.institution){
					body += "<li><strong>Institution</strong>  " + row.value.measurement.institution + "</li>";
				}
				if( row.value.measurement.technique){
					body += "<li><strong>Technique</strong>  " +row.value.measurement.technique + "</li>";
				}
				if( row.value.measurement.date !=null && row.value.measurement.date.length > 0){
					body += "<li><strong>Date</strong>  " + row.value.measurement.date + "</li>";
				}			
				if( row.value.measurement.requestor.name && row.value.measurement.requestor.contact){
					body += "<li><strong>Owner</strong><ul>" +
								"<li><strong>Name</strong>  " + row.value.measurement.requestor.name + "</li>" +
								"<li><strong>Contact</strong>  " + row.value.measurement.requestor.contact + "</li>" + 
							"</ul></li>";
				}
				if( row.value.measurement.practitioner.name && row.value.measurement.practitioner.contact){
					body += "<li><strong>Practitioner</strong><ul>" +
								"<li><strong>Name</strong>  " + row.value.measurement.practitioner.name + "</li>" +
								"<li><strong>Contact</strong>  " + row.value.measurement.practitioner.contact + "</li>" + 
							"</ul></li>";
				}			
				if(row.value.measurement.description){
					body += "<li><strong>Description  </strong>" + row.value.measurement.description +"</li>";
				}
				body += "<li><strong>Results</strong><ul>"
				for (item in row.value.measurement.results){
					body += "<li>"+ row.value.measurement.results[item].isotope +"  " +
							row.value.measurement.results[item].type +"  [" +
							row.value.measurement.results[item].value +"]  " +
							row.value.measurement.results[item].unit +"</li>";
				}
				body += "</ul></li></ul>";

				body += "<p><strong>Data Source</strong></p> <ul>"+
							"<li><strong>Reference</strong>" + row.value.data_source.reference + "</li>"+
							"<li><strong>Input</strong><ul>" +
								"<li><strong>Name</strong>  " + row.value.data_source.input.name + "</li>" +
								"<li><strong>Contact</strong>  " + row.value.data_source.input.contact + "<</li>" +
								"<li><strong>Date</strong>  " + row.value.data_source.input.date +"</li>" +
							"</ul></li>";
				if(row.value.data_source.notes){
					body += "<li><strong>Notes</strong><ul>" + row.value.data_source.notes + "</li>";
				}
				body += "</ul>";
			}
		}
		body += "</body></html>";
		return header+body;
	});
}