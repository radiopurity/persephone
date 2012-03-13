

var detailed  = false;
var collapsed = true;

// ____________________________________________________________________________________
$(function(){

   // Tabs
   $('#tabs').tabs();

   // Menu bars            
   $( "input:submit", ".menu-bar" ).button();
	$( ".menu-bar" ).click(function() { return false; });             

   // Search box auto-complete
   var availableTags = ["all"];

   $.ajax({
      url: '/mj_assays/_design/test/_view/index',
      dataType: 'json',
      async: false,
      success: function(data) {
         $.each(data.rows, function() {
            availableTags.push("\"" + this.key + "\"");
         });         
      }      
   });

	$( '#box-search' ).autocomplete({
		source: availableTags
	});           

	// Complile templates         
   $.get('templates/default.html', function(tmp) {               
      $.template("material_template", tmp);   
   });

   $( '#box-search' ).defaultValue();
   
   // Search button icon
   $( "#button-search" ).button({
      icons: {
         primary: "ui-icon-search"
      },
      text: false
   })    
   	
	$(function() {
		$( "#input-meas-date" ).datepicker();
	});  	
   	
});

// ____________________________________________________________________________________
function click_detail() {

   if (detailed) {
      
      $(".hideable").hide();
      $("input#button-detail").val("More detail");      
      detailed = false;

   } else {
      
      if (collapsed) {
         $("img[class='collapsibleClosed']").click();
         $("input#button-expand").val("Collapse");
         collapsed = false;
      }      
      
      $(".hideable").show();
      $("input#button-detail").val("Less detail");
      detailed = true;

   };   

}

// ____________________________________________________________________________________
function click_expand() {

   if (collapsed) {

      $("img[class='collapsibleClosed']").click();
      $("input#button-expand").val("Collapse");
      collapsed = false;

   } else {

      $("img[class='collapsibleOpen']").click();
      $("input#button-expand").val("Expand");      
      collapsed = true;

   };   

}

// ____________________________________________________________________________________
function click_submit() {

   if (collapsed) {

      $("img[class='collapsibleClosed']").click();
      $("input#button-expand").val("Collapse");
      collapsed = false;

   } else {

      $("img[class='collapsibleOpen']").click();
      $("input#button-expand").val("Expand");      
      collapsed = true;

   };   

}

// ____________________________________________________________________________________
function click_search() {
  
   var entry = $("#box-search").val();

   if ( entry == "" || entry == "e.g. tin") {
      $("#box-search").focus();
      $("div#materials").empty(); 
      return false;
   }    
         
   searchResults($("#box-search").val()); 
     
   collapsed = true;
   $("input#button-expand").val("Expand");
   
   detailed = false;
   $("input#button-detail").val("More detail");
   
   return false;

}; 

// ____________________________________________________________________________________
function searchResults(val) {

   var search_url  = '/mj_assays/_fti/_design/test/search?q=' + val + '&include_docs=true';

   if ( val.toLowerCase() == "all" ) {
      search_url = '/mj_assays/_all_docs?include_docs=true';
   };

   $("#materials").empty();
   
   $.ajax({ 
        
      url: search_url,
      dataType: 'json', 
      async: false,
      success: function(data) {

         if ( data.total_rows > 0 ) {

            $("#materials").append('<ul id="output">');
   
            for ( j = 0; j < data.total_rows; j++ ) { 
   
               var doc = data.rows[j].doc;
               if ( doc.type == "measurement" ) {
                  $.tmpl("material_template", doc).appendTo("#output");
               }
   
            }
   
            $("#materials").append('</ul>');
            makeCollapsible(document.getElementById('output'));
            $(".hideable").hide();

         }

      }
      
   })

};

// ____________________________________________________________________________________
function enter_box(event) {    
 
   if (event.keyCode == 13) {
      
      $( "#box-search" ).autocomplete("close");
      click_search();
      event.returnValue = false; // for IE
      if (event.preventDefault()) event.preventDefault(); 
   
   }

   return false;     
        
}  

// ____________________________________________________________________________________
function make_input_form() { 

var form_html = '

<form> 

   <fieldset class="ui-widget ui-widget-content ui-corner-all entry">   
	<legend>Name</legend> 
   <div class="input-row">
      <label class="input-label">Name</label>
      <input id="input-name" placeholder="Brief description" 
         class="input-box ui-widget-content ui-corner-all" style="width:300px"/>
   </div>              
	</fieldset> 
            
          	<fieldset class="ui-widget ui-widget-content ui-corner-all entry">
          	   <legend>Sample</legend> 
               <div class="input-row">
             	   <label class="input-label">Description</label>
             		<input id="input-sample-desc" placeholder="Detailed description" class="input-box ui-widget-content ui-corner-all" style="width:400px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Source</label>
             		<input id="input-sample-source" class="input-box ui-widget-content ui-corner-all" style="width:250px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Owner</label>
             		<input id="input-sample-owner" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Set</label>
             		<input id="input-sample-set" placeholder="Tags separated by spaces" class="input-box ui-widget-content ui-corner-all" style="width:250px"/>
               </div>               
               <div class="input-row">
             	   <label class="input-label-opt">Mass</label>
             		<input id="input-sample-mass" placeholder="Include unit" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label-opt">Geometry</label>
             		<input id="input-sample-geom" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div> 
          	</fieldset> 

          	<fieldset class="ui-widget ui-widget-content ui-corner-all entry">
          	   <legend>Measurement</legend>
               <div class="input-row">
             	   <label class="input-label">Technique</label>
             		<input id="input-meas-tech" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Institution</label>
             		<input id="input-meas-inst" placeholder="Where it was counted" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Date</label>
             		<input id="input-meas-date" placeholder="mm/dd/yyyy" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Requester</label>
             		<input id="input-meas-req" placeholder="Name" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
             		<input id="input-meas-reqcon" placeholder="Email or institution" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Practitioner</label>
             		<input id="input-meas-prac" placeholder="Name" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
             		<input id="input-meas-praccon" placeholder="Email or institution" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Description</label>
             		<textarea id="input-meas-desc" placeholder="Detailed description" cols="60" rows="10" class="input-textarea ui-widget-content ui-corner-all"></textarea>
               </div>               
               <div class="input-row">
             	   <label class="input-label">Result</label>
                  <span id="input-results-1">
             		<input id="input-result-1-isotope" placeholder="Isotope" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
             		<select id="input-result-1-isotope" placeholder="Isotope" class="input-select ui-widget-content ui-corner-all" style="width:100px"><option value="Meas">Meas.</option><option value="Limit">Limit</option></select>
             		<input id="input-result-1-value" placeholder="Value" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
             		<input id="input-result-1-error" placeholder="Error / c.l." class="input-box ui-widget-content ui-corner-all" style="width:100px"/>   
             		<input id="input-result-1-error" placeholder="Unit" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>                		          		                  
                  </span><br>                                  
               </div>
               <div class="input-row">
             	   <label class="input-label"></label>
                  <span id="input-results-2">
             		<input id="input-result-2-isotope" placeholder="Isotope" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
             		<select id="input-result-2-isotope" placeholder="Isotope" class="input-select ui-widget-content ui-corner-all" style="width:100px"><option value="Meas">Meas.</option><option value="Limit">Limit</option></select>
             		<input id="input-result-2-value" placeholder="Value" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
             		<input id="input-result-2-error" placeholder="Error / c.l." class="input-box ui-widget-content ui-corner-all" style="width:100px"/>   
             		<input id="input-result-2-error" placeholder="Unit" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>                		          		                  
                  </span><br>                                  
               </div>               
               <div class="input-row">
             	   <label class="input-label"></label>
                  <span id="input-results-3">
             		<input id="input-result-3-isotope" placeholder="Isotope" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
             		<select id="input-result-3-isotope" placeholder="Isotope" class="input-select ui-widget-content ui-corner-all" style="width:100px"><option value="Meas">Meas.</option><option value="Limit">Limit</option></select>
             		<input id="input-result-3-value" placeholder="Value" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
             		<input id="input-result-3-error" placeholder="Error / c.l." class="input-box ui-widget-content ui-corner-all" style="width:100px"/>   
             		<input id="input-result-3-error" placeholder="Unit" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>                		          		                  
                  </span><br>                                  
               </div>
               <div class="input-row">
             	   <label class="input-label-opt">Count length</label>
             		<input id="input-meas-len" placeholder="Include unit" class="input-box ui-widget-content ui-corner-all" style="width:100px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label-opt">Detector</label>
             		<input id="input-meas-det" placeholder="Instrument name" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div>               
          	</fieldset> 

          	<fieldset class="ui-widget ui-widget-content ui-corner-all entry">
          	   <legend>Data entry</legend> 
               <div class="input-row">
             	   <label class="input-label">Reference</label>
             		<input id="input-data-ref" placeholder="Original data source" class="input-box ui-widget-content ui-corner-all" style="width:200px"/>
               </div>
               <div class="input-row">
             	   <label class="input-label">Entry by</label>
             		<input id="input-data-entry" placeholder="Name" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
             		<input id="input-meas-entrycon" placeholder="Email or institution" class="input-box ui-widget-content ui-corner-all" style="width:150px"/>
               </div>
          	</fieldset> 

          	</form>'

}






