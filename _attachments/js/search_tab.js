/*
$File: search_tab.js
$Author: Zheng Li
$Description: this part handles query, filter, scroll function for search tab
*/

var total_rows=0,bookmark,max_entries=20,search_url,skip=0,val;
var Th_priority = ["Th", "Th-232", "232-Th", "Th232", "232Th"];
var U_priority = ["U", "U-238", "238-U", "U238", "238U"];

/*==== click and search for result ====*/
function click_search() {
	var entry = $("#box-search").val();
	val = entry;
	if ( entry == "" || entry == "e.g. all") {
		$("#box-search").focus();		
		$("#materials").empty(); 
		$("#status-line").empty();
		$(".table-header").hide();
		total_rows=0;
		skip=0;
		return false;
	}		

	searchResults(entry); 

	return false;
}; 

/*===== decorate the search result ====*/
ButtonFade = function(){
			var parent = $(this).closest('div');
			parent.find('.detail-button').slideToggle(100);

			parent.find('.heading-isotope-name-short').toggle();
		};

function DecorateResult() {
	$("#materials > div").accordion({ 
		header: "h3", 
		navigation: true, 
		collapsible:true, 
		heightStyle: "content",
		create: function(event) { 
			$(event.target).accordion( "activate", false ); 
		} 
	});
	$( "#materials" ).sortable({axis: "y",handle: "h3"});

	/* delete button */
	$(".delete-button").button({
		icons:{primary:"ui-icon-close"},
		text:false
	})
	$(".delete-button" ).click(function(event){
		event.stopPropagation(); // this is
		event.preventDefault(); // the magic
		var parent = $(this).closest('div');
		var head = parent.prev('h3');
		parent.add(head).hide(function(){$(this).remove();});
	});

	/* detail button */
	$(".detail-button").button({
		icons:{primary:"ui-icon-zoomin"},
		text:false
	})
	$(".detail-button" ).unbind();
	$(".detail-button" ).click(function(event){
		event.stopPropagation(); // this is
		event.preventDefault(); // the magic
		var parent = $(this).closest('div');
		parent.find('.hideable').fadeToggle();
		$(".ui-button-icon-primary", this)
			.toggleClass("ui-icon-zoomin ui-icon-zoomout");				 
	});

	/* export button */
	$(".export-button").button({
		icons:{primary:"ui-icon-link"},
		text:false
	})
	$(".export-button" ).unbind();
	$(".export-button" ).click(function(event){
		event.stopPropagation(); // this is
		event.preventDefault(); // the magic
		var parent = $(this).closest('div');
		parent.find('.export-option').fadeToggle();
		$(".ui-button-icon-primary", this)
			.toggleClass("ui-icon-link ui-icon-arrowthickstop-1-s");				 
	});

	$(".export-json").click(function(event){
		var parent = $(this).closest('div');
		url = window.location.protocol + '//' + window.location.host 
				+ '/' + dbname+'/'+parent.attr('value');
		window.open(url, '_blank');
	});

	$(".export-xml").click(function(event){
		var parent = $(this).closest('div');
		url = window.location.protocol + '//' + window.location.host 
				+ '/' + dbname+'/_design/persephone/_list/exportXML/query-by-id?_id='+parent.attr('value');
		window.open(url, '_blank');
	});

	/* decorate h3 */
	$("h3").unbind('click',ButtonFade);
	$("h3").bind('click', ButtonFade);
};

/* fill the JSON into the output_template.html*/
function FillTemplate(doc){
	var th={ "isotope":"-", "type":"measurement","value":["-"],"unit":"-"},u={ "isotope":"-", "type":"measurement","value":["-"],"unit":"-"}
	var pri_th=100,pri_u=100;
	if ( doc.type == "measurement" ) {
		for(var k in doc.measurement.results){
			var item = doc.measurement.results[k];
			// select Th
			for (var i = 0; i < Th_priority.length; i++) {
				if (item.isotope == Th_priority[i] && i < pri_th){
					th = item;
					pri_th = i;
				}
			};

			// select U
			for (var i = 0; i < U_priority.length; i++) {
				if (item.isotope == U_priority[i] && i < pri_u){
					u = item;
					pri_u = i;
				}
			};
		}

		doc.iso = [th , u];
		
		var tt = $.tmpl("output_template", doc);
		$("#materials").append(tt);
	}
}

/*==== search for result ====*/
function searchResults(val) {
	// clear the page
	$("#materials").empty();
	$("#status-line").empty();
	// show table header
	$(".table-header").show();

	var n_entries;
	skip=0;
	total_rows=0;
	
	if ( window.location.host.split(".")[1] == "cloudant" ) {			
		search_url = window.location.protocol + '//' + window.location.host 
							 + '/' + dbname + '/_design/persephone/_search/assays?q='		 
							 + val + '&include_docs=true&limit=' + max_entries;
	}
		
	if ( val == "all" || val == "All" ) {
		search_url = '/' + dbname + '/_design/persephone/_view/query-by-group?limit='+ max_entries +'&include_docs=true';
		// search_url = '/' + dbname + '/_all_docs?limit='+ max_entries +'&include_docs=true&descending=true';
	}

	$.ajax({ 
		url: search_url,
		dataType: 'json',
		async: false,
		success: function(data) { 
			total_rows=data.total_rows;
			$("#status-line").append('Total result: ' + data.total_rows);				
			if ( data.total_rows > 0 ) {
				if ( data.total_rows > max_entries ) {
					n_entries = max_entries;
				} else {				 
					n_entries = data.total_rows;								 
				};

				if (data.bookmark){
					bookmark = data.bookmark;
				}

				for ( j = 0; j < n_entries; j++ ) {	
					var doc = data.rows[j].doc;

					FillTemplate(doc);
				}

				DecorateResult();
				
				$('#materials').infiniScroll('pollLevel');
			}
		}
	})
};

/*==== order by Th ====*/
function query_by_Th(val) {
	// clear the page
	$("#materials").empty();
	$("#status-line").empty();
	// show table header
	$(".table-header").show();

	$("table-header").css("color" , "#dddddd");
	$(this).css("color", "#e18e94");

	var n_entries;
	skip=0;
	total_rows=0;
	
	if ( window.location.host.split(".")[1] == "cloudant" ) {			
		search_url = window.location.protocol + '//' + window.location.host 
							 + '/' + dbname + '/_design/persephone/_search/assays?q='		 
							 + val + '&include_docs=true&limit=' + max_entries;
	}
		
	if ( val == "all" || val == "All" ) {
		search_url = '/' + dbname + '/_design/persephone/_view/query-by-Th?limit='+ max_entries +'&include_docs=true';
	}

	$.ajax({ 
		url: search_url,
		dataType: 'json',
		async: false,
		success: function(data) { 
			total_rows=data.total_rows;
			$("#status-line").append('Total result: ' + data.total_rows);				
			if ( data.total_rows > 0 ) {
				if ( data.total_rows > max_entries ) {
					n_entries = max_entries;
				} else {				 
					n_entries = data.total_rows;								 
				};

				if (data.bookmark){
					bookmark = data.bookmark;
				}

				for ( j = 0; j < n_entries; j++ ) {	
					var doc = data.rows[j].doc;

					FillTemplate(doc);
				}

				DecorateResult();
				
				$('#materials').infiniScroll('pollLevel');
			}
		}
	})
};

/*==== enter box ====*/
function enter_box(event) {		
	
	if (event.keyCode == 13) {
			
		//$( "#box-search" ).autocomplete("close");
		click_search();
		event.returnValue = false; // for IE
		if (event.preventDefault()) event.preventDefault(); 
	 
	}

	return false;		 
}	

/*==== email_link ====*/
function email_link(user, dom, linkText) {
	
 return document.write( "<a href=" + "mail" + "to:" + user + "@" + dom
	 + ">" + linkText + "<\/a>" );

}

/*==== back to top jQuery ====*/
$(document).ready(function(){

	// invoke thfloat() twice; once for "head" and once for "foot"; both attach to window

	// decorate table-header
	$(".table-header").accordion({ 
			header: "h3", 
			icons: { "header": "ui-icon-grip-diagonal-se", "activeHeader": "ui-icon-bullet" },
			collapsible:true, 
			disabled: true,
			heightStyle: "content",
		});

	// hide #back-top first
	$("#back-top").hide();
	$("#spinner").hide();
	
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('#back-top a').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});

});

/*==== infinity scroll ====*/
(function( $ ){
	var _checkLevel = function() { 
		// if it's low enough, grab latest data
		if (!_levelReached()){
			return methods.pollLevel();
		} else {
			var moreresult = new Boolean(0);
			var url;

			if(skip+max_entries < total_rows){
				moreresult = new Boolean(1);
				skip = skip + max_entries;
				url = search_url + "&skip=" + skip;
			}

			if(val != "all" && val != "All"){
				url = search_url + "&bookmark=" + bookmark;
			}

			if (moreresult == true){
				$('#'+settings.loading_elem).show();
				$.ajax({
					type: "GET",
					url: url,
					dataType: 'json',
					timeout: 3000,
					success: function(data) {
							$('#'+settings.loading_elem).hide();

							if (data.bookmark){
								bookmark = data.bookmark;
							}

							var i;
							for ( i in data.rows ) {	
								var doc = data.rows[i].doc;

								FillTemplate(doc);
							}
							DecorateResult();
							methods.pollLevel()
						} 
					});
				}	// do not make ajax request if it's the only one left
				// else{
				//	 $('#spinner').hide();
				// }
			}
	};
	
	var _setLastID = function(elem, lastID){
		elem.data("lastID", lastID);
	};

	var _levelReached = function(){
		// is it low enough to add elements to bottom?
		var pageHeight = Math.max(document.body.scrollHeight ||
			document.body.offsetHeight);
		var viewportHeight = window.innerHeight	||
			document.documentElement.clientHeight	||
			document.body.clientHeight || 0;
		var scrollHeight = window.pageYOffset ||
			document.documentElement.scrollTop	||
			document.body.scrollTop || 0;
		// Trigger for scrolls within 20 pixels from page bottom
		return pageHeight - viewportHeight - scrollHeight < 30;
	};

	/* PUBLIC METHODS */
	var methods = {
		init : function( options ) { 
			$('#'+settings.loading_elem).hide();
		},

		pollLevel : function() {
			// checking every so often:	
			setTimeout(_checkLevel, 100);
		}	 
	};
	
	var settings = {
		 'interval'		 : 100
		,'loading_elem' : 'spinner'
		,'num'					: 5
		,'sort'				 : 'desc'
	};

	$.fn.infiniScroll = function(method) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +	method + ' does not exist on jQuery.infiniScroll' );
		}	
	}

})( jQuery );

/* Export JSON */
function ExportJSON(JSONid){ 
    // Start Excel and get Application object. 
    var oXL = new ActiveXObject("Excel.Application"); 
    // Get a new workbook. 
    var oWB = oXL.Workbooks.Add(); 
    var oSheet = oWB.ActiveSheet; 
    var hang = objTable.rows.length; 

    var lie = objTable.rows(0).cells.length; 

    // Add table headers going cell by cell. 
    for (var i=0;i<hang;i++) 
    { 
        for (var j=0;j<lie;j++) 
        { 
            oSheet.Cells(i+1,j+1).value = objTable.rows(i).cells(j).innerText; 
        } 

    } 
    oXL.Visible = true; 
    oXL.UserControl = true; 
} 
