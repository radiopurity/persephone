var dbname = window.location.pathname.split("/")[1];
var appName = window.location.pathname.split("/")[3];
var db = $.couch.db(dbname);

var detailed  = false;
var collapsed = true;

// ____________________________________________________________________________________
$(function(){

  // Tabs
  $('#tabs').tabs();

  // Menu bars            
  $( "input:submit", ".menu-bar" ).button();
  $( ".menu-bar" ).click(function() { return false; });             

  // Plug-in to style placeholder in old Browsers
  $( "input, textarea" ).placehold( "something-temporary" );

  /*
  // Search box auto-complete [CURRENTLY DISABLED]
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
  */

  // Template - input      
  $.get('templates/default_input.html', function(tmp) {               

    $.template("input_template", tmp);   
    $.tmpl("input_template", null).appendTo("#input-form");

    $( ".add-entry" ).button({
      icons: {
        primary: "ui-icon-plus"
      },
      text: false
    })

    $( ".remove-entry" ).button({
      icons: {
        primary: "ui-icon-minus"
      },
      text: false
    })

    $(function() {
      $( "#idate" ).datepicker();
    }); 

    // Form validation
        
    var validator = $("#input").validate({
       
      rules: {
        iname:     "required", 
        idesc:     "required",
        isrc:      "required",
        iown:      "required", 
        itags:     "required", 
        itech:     "required", 
        iinst:     "required",
        idate:     "required date", 
        ireq:      "required", 
        reqcon:   "required",
        iprac:     "required",
        ipraccon:  "required", 
        imdesc:    "required", 
        iisotope:  "required", 
        iref:      "required",                                                                       
        ientry:    "required",  
        ientrycon: "required email"
      }, 
                   
      messages: {
        iname:     "Required", 
        idesc:     "Full description required (> 10 characters)",
        isrc:      "Required",
        iown:      "Required", 
        itags:     "At least one tag required", 
        itech:     "Required (e.g. ICP-MS, gamma)", 
        iinst:     "Required",
        idate:     "Required", 
        ireq:      "Required", 
        ireqcon:   "Required",
        iprac:     "Required",
        ipraccon:  "Required", 
        imdesc:    "Required",
        iisotope:  "Test",              
        iref:      "Required",                                                                       
        ientry:    "Required",  
        ientrycon: "Valid email required"
      },
         
      errorPlacement: function(error, element) {
        error.appendTo(element.next('.istatus'));
      }      
       
    });   
        
  });
   
  // Template - output
  $.get('templates/default_output.html', function(tmp) {               
    $.template("output_template", tmp);   
  });
   
  // Search button icon     
  $( "#button-search" ).button({
    icons: {
      primary: "ui-icon-search"
    },
    text: false
  });

  $( "#button-expand" ).button();   
  $( "#button-detail" ).button();   

  $( "#button-clear1" ).button();   
  $( "#button-clear2" ).button();
  $( "#button-check" ).button();   
  $( "#button-submit" ).button();  

  $( "#button-feedback" ).button(); 

  $( "#dialog-submit" ).dialog({ autoOpen: false, modal: true, resizable: false });   
  $( "#dialog-feedback" ).dialog({ autoOpen: false, modal: true, resizable: false });

  $("input:text:visible:first").focus();

  var validator = $("#feedback").validate({
     
    rules: {
      fname:     "required", 
      femail:    "required email",
    }, 
                 
    messages: {
      fname:     "Required", 
      femail:    "Valid email required", 
    },
      
    errorPlacement: function(error, element) {
       error.appendTo(element.next('.istatus'));
    }      
     
  });   

});

// ____________________________________________________________________________________
function add_result_entry(elem) {
   
  $("div.results-block > div:first-child")
    .clone()
    .removeClass('template')
    .addClass('result-row')
    .insertAfter($(elem).parent()).show();

}

// ____________________________________________________________________________________
function remove_result_entry(elem) {
   
  $(elem).parent().remove();
      
}

// ____________________________________________________________________________________
function limit_error(elem) {
     
  if ( $(elem).val() == "Meas" ) {
    $(elem).next().next().attr("placeholder", "Error");
  } else {
    $(elem).next().next().attr("placeholder", "Confidence level");      
  }
   
}

// ____________________________________________________________________________________
function click_clear_all() {

  $(':input','#input')
    .not(':button, :submit, :reset, :hidden')
    .val('')
    .removeAttr('checked')
    .removeAttr('selected');

  $("#input").validate().resetForm()

}

// ____________________________________________________________________________________
function click_clear_warnings() {

  $("#input").validate().resetForm()

}

// ____________________________________________________________________________________
function click_check() {

  $("#input").validate().form() 

}

// ____________________________________________________________________________________
function click_submit() {

  $("#input").validate().form();
 
  if ( $("#input").validate().numberOfInvalids() == 0 ) {           

    // Parse the date

    var arr_idate = $("#idate").val().split("/");
       
    var imonth = arr_idate[0]; 
    var iday   = arr_idate[1]; 
    var iyear  = arr_idate[2]; 
      
    // Build the JSON for the results 
    //   (complex because fields don't have unique IDs)
      
    //var n_results = $(".results-block").children('div.result-row').length;

    var iresult = {};

    $(".results-block").children('div.result-row').each(function(i) {
         
      // Loop through all the results for this measurement
         
      var iisotope = $(this).find(".iisotope").val();
      var iselect  = $(this).find(".iselect").val();
      var ivalue   = $(this).find(".ivalue").val();
      var ierror   = $(this).find(".ierror").val();         
      var iunit    = $(this).find(".iunit").val();  
         
      if ( iselect == "Meas" ) {  
            
        // Measurement
            
        iresult[i] = {
          "isotope": iisotope,
          "value":   ivalue,
          "error":   ierror,
          "unit":    iunit 
        };                                    
               
      } else {
              
        // Limit  
              
        iresult[i] = {
          "isotope": iisotope,
          "limit":   ivalue,
          "error":   ierror,
          "unit":    iunit 
        }; 
              
      }
         
    });
      
    // Build the overall JSON
            
    var output_json =  {
    
      "type": "measurement-provisional",
      "sample": {
        "name":        $("#iname").val(),
        "description": $("#idesc").val(),
        "source":      $("#isrc").val(),
        "owner":       $("#iown").val(),
        "set":         $("#itags").val(),
        "mass":        $("#imass").val(),
        "geometry":    $("#igeom").val()
      },
      "measurement": {
        "institution": $("#iinst").val(),
        "technique":   $("#itech").val(),
        "date": {
        "day":     iday,
        "month":   imonth,
        "year":    iyear
      },
      "results":     iresult,
      "requestor":            $("#ireq").val(),
      "requestor_contact":    $("#ireqcon").val(),
      "practitioner":         $("#iprac").val(),
      "practitioner_contact": $("#ipraccon").val(),
      "description":          $("#imdesc").val()
      },
      "data_source": {
         "reference":          $("#iref").val(),
         "data_entry_name":    $("#ientry").val(),
         "data_entry_contact": $("#ientrycon").val()
      }
            
    };
      
    db.saveDoc(
    
      output_json,

      { success: function() {
        $( "#dialog-submit" ).dialog( "open" );
        $(':input','#feedback')
          .not(':button, :submit, :reset, :hidden')
          .val('')
          .removeAttr('checked')
          .removeAttr('selected');
        }}

      );

   } 

}

// ____________________________________________________________________________________
function click_feedback() {

  $("#feedback").validate().form();
   
  if ( $("#feedback").validate().numberOfInvalids() == 0 ) {           
      
    db.saveDoc(
      {
        "type"             : "feedback",
        "name"             : $("#fname").val(),
        "email_feedback"   : $("#femail").val(),
        "feedback"         : $("#fcomment").val()
      },
      { success: function() {
        $( "#dialog-feedback" ).dialog( "open" );
        $(':input','#feedback')
          .not(':button, :submit, :reset, :hidden')
          .val('')
          .removeAttr('checked')
          .removeAttr('selected');
        }}
      );

   }   

}

// ____________________________________________________________________________________
function click_detail() {

  if (detailed) {
      
    $(".hideable").hide();
    $("input#button-detail").val("More detail");      
    detailed = false;

  } else {
      
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
function click_search() {
  
  var entry = $("#box-search").val();

  if ( entry == "" || entry == "e.g. all") {
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

  var search_url; 

  search_url  = $.couch.urlPrefix + '/_fti/local/' + dbname + '/_design/' + appName + '/fullsearch?q=' + val; 
    
  if (window.location.host.split(".")[1] == "cloudant"){
    search_url = window.location.protocol + '//' + window.location.host + '/' + dbname + '/_search?q=' + val; 
  }
    
  if ( val.toLowerCase() == "all" ) {
    search_url = '/' + dbname + '/_all_docs?include_docs=true';
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
            $.tmpl("output_template", doc).appendTo("#output");
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
 
 console.log('hello');
 
  if (event.keyCode == 13) {
      
    //$( "#box-search" ).autocomplete("close");
    click_search();
    event.returnValue = false; // for IE
    if (event.preventDefault()) event.preventDefault(); 
   
  }

  return false;     
        
}  


