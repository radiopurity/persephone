var dbname = window.location.pathname.split("/")[1];
var appName = window.location.pathname.split("/")[3];
var db = $.couch.db(dbname);

var isotopes = ["Ac-224", "Ac-226", "Ac-227", "Ac-228", "Ac-229", "Ac", "Ag-103", "Ag-104", "Ag-105", "Ag-107", "Ag-109", "Ag-111", "Ag-112", "Ag-113", "Ag", "Al-26", "Al-27", "Al", "Am-237", "Am-238", "Am-239", "Am-240", "Am-241", "Am-243", "Am-244", "Am-245", "Am", "Ar-36", "Ar-37", "Ar-38", "Ar-39", "Ar-40", "Ar-41", "Ar-42", "Ar", "As-71", "As-72", "As-73", "As-74", "As-75", "As-76", "As-77", "As-78", "As", "At-207", "At-208", "At-209", "At-210", "At-211", "At", "Au-191", "Au-192", "Au-193", "Au-194", "Au-195", "Au-196", "Au-197", "Au-198", "Au-199", "Au", "B-10", "B-11", "B", "Ba-126", "Ba-128", "Ba-129", "Ba-130", "Ba-131", "Ba-132", "Ba-133", "Ba-134", "Ba-135", "Ba-136", "Ba-137", "Ba-138", "Ba-139", "Ba-140", "Ba", "Be-10", "Be-7", "Be-9", "Be", "Bh", "Bi-201", "Bi-202", "Bi-203", "Bi-204", "Bi-205", "Bi-206", "Bi-207", "Bi-208", "Bi-209", "Bi-212", "Bi", "Bk-243", "Bk-244", "Bk-245", "Bk-246", "Bk-247", "Bk-248", "Bk-249", "Bk-250", "Bk", "Br-75", "Br-76", "Br-77", "Br-79", "Br-81", "Br-82", "Br-83", "Br", "C-12", "C-13", "C-14", "C", "Ca-40", "Ca-41", "Ca-42", "Ca-43", "Ca-44", "Ca-45", "Ca-46", "Ca-47", "Ca-48", "Ca", "Cd-106", "Cd-107", "Cd-108", "Cd-109", "Cd-110", "Cd-111", "Cd-112", "Cd-113", "Cd-114", "Cd-116", "Cd", "Ce-132", "Ce-134", "Ce-135", "Ce-136", "Ce-138", "Ce-139", "Ce-140", "Ce-141", "Ce-142", "Ce-143", "Ce-144", "Ce", "Cf-246", "Cf-247", "Cf-248", "Cf-249", "Cf-250", "Cf-251", "Cf-252", "Cf-253", "Cf-254", "Cf-255", "Cf", "Cl-35", "Cl-36", "Cl-37", "Cl", "Cm-238", "Cm-239", "Cm-240", "Cm-241", "Cm-242", "Cm-243", "Cm-244", "Cm-245", "Cm-246", "Cm-247", "Cm-248", "Cm-249", "Cm-250", "Cm-252", "Cm", "Cn", "Co-55", "Co-56", "Co-57", "Co-58", "Co-59", "Co-60", "Co-61", "Co", "Cr-48", "Cr-50", "Cr-51", "Cr-52", "Cr-53", "Cr-54", "Cr", "Cs-127", "Cs-129", "Cs-131", "Cs-132", "Cs-133", "Cs-134", "Cs-135", "Cs-136", "Cs-137", "Cs", "Cu-61", "Cu-63", "Cu-64", "Cu-65", "Cu-67", "Cu", "Db-267", "Db-268", "Db-269", "Db", "Ds", "Dy-152", "Dy-153", "Dy-154", "Dy-155", "Dy-156", "Dy-157", "Dy-158", "Dy-159", "Dy-160", "Dy-161", "Dy-162", "Dy-163", "Dy-164", "Dy-165", "Dy-166", "Dy", "Er-158", "Er-160", "Er-161", "Er-162", "Er-163", "Er-164", "Er-165", "Er-166", "Er-167", "Er-168", "Er-169", "Er-170", "Er-171", "Er-172", "Er", "Es-249", "Es-250", "Es-251", "Es-252", "Es-253", "Es-254", "Es-255", "Es-257", "Es", "Eu-145", "Eu-146", "Eu-147", "Eu-148", "Eu-149", "Eu-150", "Eu-151", "Eu-152", "Eu-153", "Eu-154", "Eu-155", "Eu-156", "Eu-157", "Eu", "F-18", "F-19", "F", "Fe-52", "Fe-54", "Fe-55", "Fe-56", "Fe-57", "Fe-58", "Fe-59", "Fe-60", "Fe", "Fl", "Fm-251", "Fm-252", "Fm-253", "Fm-254", "Fm-255", "Fm-256", "Fm-257", "Fm", "Fr", "Ga-66", "Ga-67", "Ga-68", "Ga-69", "Ga-71", "Ga-72", "Ga-73", "Ga", "Gd-146", "Gd-147", "Gd-148", "Gd-149", "Gd-150", "Gd-151", "Gd-152", "Gd-153", "Gd-154", "Gd-155", "Gd-156", "Gd-157", "Gd-158", "Gd-159", "Gd-160", "Gd", "Ge-66", "Ge-68", "Ge-69", "Ge-70", "Ge-71", "Ge-72", "Ge-73", "Ge-74", "Ge-75", "Ge-76", "Ge-77", "Ge-78", "Ge", "H-1", "H-2", "H-3", "H", "He-3", "He-4", "He", "Hf-170", "Hf-171", "Hf-172", "Hf-173", "Hf-174", "Hf-175", "Hf-176", "Hf-177", "Hf-178", "Hf-179", "Hf-180", "Hf-181", "Hf-182", "Hf-183", "Hf-184", "Hf", "Hg-192", "Hg-194", "Hg-196", "Hg-197", "Hg-198", "Hg-199", "Hg-200", "Hg-201", "Hg-202", "Hg-203", "Hg-204", "Hg", "Ho-161", "Ho-163", "Ho-165", "Ho-167", "Ho", "Hs", "I-120", "I-121", "I-123", "I-124", "I-125", "I-126", "I-127", "I-129", "I-130", "I-131", "I-132", "I-133", "I-135", "I", "In-109", "In-110", "In-111", "In-113", "In-115", "In", "Ir-184", "Ir-185", "Ir-186", "Ir-187", "Ir-188", "Ir-189", "Ir-190", "Ir-191", "Ir-193", "Ir", "K-39", "K-40", "K-41", "K-42", "K-43", "K", "Kr-76", "Kr-77", "Kr-78", "Kr-79", "Kr-80", "Kr-81", "Kr-82", "Kr-83", "Kr-84", "Kr-85", "Kr-86", "Kr-87", "Kr-88", "Kr", "La-132", "La-133", "La-135", "La-137", "La-138", "La-139", "La-140", "La-141", "La-142", "La", "Li-6", "Li-7", "Li", "Lr-262", "Lr", "Lu-169", "Lu-170", "Lu-171", "Lu-172", "Lu-173", "Lu-174", "Lu-175", "Lu-176", "Lu-179", "Lu", "Lv", "Md-256", "Md-257", "Md-258", "Md-259", "Md-260", "Md", "Mg-24", "Mg-25", "Mg-26", "Mg-28", "Mg", "Mn-52", "Mn-53", "Mn-54", "Mn-55", "Mn-56", "Mn", "Mo-100", "Mo-90", "Mo-92", "Mo-93", "Mo-94", "Mo-95", "Mo-96", "Mo-97", "Mo-98", "Mo-99", "Mo", "Mt", "N-14", "N-15", "N", "Na-22", "Na-23", "Na-24", "Na", "Nb-89", "Nb-90", "Nb-91", "Nb-92", "Nb-93", "Nb-94", "Nb-95", "Nb-96", "Nb-97", "Nb", "Nd-138", "Nd-140", "Nd-141", "Nd-142", "Nd-143", "Nd-144", "Nd-145", "Nd-146", "Nd-147", "Nd-148", "Nd-149", "Nd-150", "Nd", "Ne-20", "Ne-21", "Ne-22", "Ne", "Ni-56", "Ni-57", "Ni-58", "Ni-59", "Ni-60", "Ni-61", "Ni-62", "Ni-63", "Ni-64", "Ni-65", "Ni-66", "Ni", "No", "Np-234", "Np-235", "Np-236", "Np-237", "Np-238", "Np-239", "Np-240", "Np", "O-16", "O-17", "O-18", "O", "Os-181", "Os-182", "Os-183", "Os-184", "Os-185", "Os-186", "Os-187", "Os-188", "Os-189", "Os-190", "Os-191", "Os-192", "Os-193", "Os-194", "Os", "P-31", "P-32", "P-33", "P", "Pa-228", "Pa-229", "Pa-230", "Pa-231", "Pa-232", "Pa-233", "Pa-234", "Pa-239", "Pa", "Pb-198", "Pb-199", "Pb-200", "Pb-201", "Pb-202", "Pb-203", "Pb-204", "Pb-205", "Pb-206", "Pb-207", "Pb-208", "Pb-209", "Pb-210", "Pb-212", "Pb", "Pd-100", "Pd-101", "Pd-102", "Pd-103", "Pd-104", "Pd-105", "Pd-106", "Pd-107", "Pd-108", "Pd-109", "Pd-110", "Pd-112", "Pd", "Pm-143", "Pm-144", "Pm-145", "Pm-146", "Pm-147", "Pm-149", "Pm-150", "Pm-151", "Pm", "Po-204", "Po-205", "Po-206", "Po-207", "Po-208", "Po-209", "Po-210", "Po", "Pr-137", "Pr-139", "Pr-141", "Pr-142", "Pr-143", "Pr-145", "Pr", "Pt-185", "Pt-186", "Pt-187", "Pt-188", "Pt-189", "Pt-190", "Pt-191", "Pt-192", "Pt-193", "Pt-194", "Pt-195", "Pt-196", "Pt-197", "Pt-198", "Pt-200", "Pt-202", "Pt", "Pu-234", "Pu-236", "Pu-237", "Pu-238", "Pu-239", "Pu-240", "Pu-241", "Pu-242", "Pu-243", "Pu-244", "Pu-245", "Pu-246", "Pu-247", "Pu", "Ra-223", "Ra-224", "Ra-225", "Ra-226", "Ra-228", "Ra-230", "Ra", "Rb-81", "Rb-83", "Rb-84", "Rb-85", "Rb-86", "Rb-87", "Rb", "Re-181", "Re-182", "Re-183", "Re-185", "Re-187", "Re-188", "Re-189", "Re", "Rf-265", "Rf-266", "Rf-267", "Rf", "Rg", "Rh-100", "Rh-101", "Rh-103", "Rh-105", "Rh-99", "Rh", "Rn-210", "Rn-211", "Rn-222", "Rn-224", "Rn", "Ru-100", "Ru-101", "Ru-102", "Ru-103", "Ru-104", "Ru-105", "Ru-106", "Ru-95", "Ru-96", "Ru-97", "Ru-98", "Ru-99", "Ru", "S-32", "S-33", "S-34", "S-35", "S-36", "S-38", "S", "Sb-117", "Sb-119", "Sb-121", "Sb-122", "Sb-123", "Sb-124", "Sb-125", "Sb-126", "Sb-127", "Sb-128", "Sb-129", "Sb", "Sc-43", "Sc-45", "Sc-46", "Sc-47", "Sc-48", "Sc", "Se-72", "Se-73", "Se-74", "Se-75", "Se-76", "Se-77", "Se-78", "Se-79", "Se-80", "Se-82", "Se", "Sg", "Si-28", "Si-29", "Si-30", "Si-31", "Si-32", "Si", "Sm-142", "Sm-144", "Sm-145", "Sm-146", "Sm-147", "Sm-148", "Sm-149", "Sm-150", "Sm-151", "Sm-152", "Sm-153", "Sm-154", "Sm-156", "Sm", "Sn-110", "Sn-112", "Sn-113", "Sn-114", "Sn-115", "Sn-116", "Sn-117", "Sn-118", "Sn-119", "Sn-120", "Sn-122", "Sn-123", "Sn-124", "Sn-125", "Sn-126", "Sn-127", "Sn", "Sr-80", "Sr-82", "Sr-83", "Sr-84", "Sr-85", "Sr-86", "Sr-87", "Sr-88", "Sr-89", "Sr-90", "Sr-91", "Sr-92", "Sr", "Ta-173", "Ta-174", "Ta-175", "Ta-176", "Ta-177", "Ta-179", "Ta-181", "Ta-182", "Ta-183", "Ta-184", "Ta", "Tb-147", "Tb-148", "Tb-149", "Tb-150", "Tb-151", "Tb-152", "Tb-153", "Tb-155", "Tb-156", "Tb-157", "Tb-158", "Tb-159", "Tb-160", "Tb-161", "Tb", "Tc-93", "Tc-94", "Tc-96", "Tc-97", "Tc-98", "Tc-99", "Tc", "Te-116", "Te-117", "Te-118", "Te-120", "Te-122", "Te-123", "Te-123", "Te-124", "Te-125", "Te-126", "Te-128", "Te-130", "Te-132", "Te", "Th-227", "Th-228", "Th-229", "Th-230", "Th-231", "Th-232", "Th-234", "Th", "Ti-44", "Ti-45", "Ti-46", "Ti-47", "Ti-48", "Ti-49", "Ti-50", "Ti", "Tl-195", "Tl-196", "Tl-197", "Tl-198", "Tl-199", "Tl-200", "Tl-201", "Tl-202", "Tl-203", "Tl-204", "Tl-205", "Tl", "Tm-163", "Tm-165", "Tm-166", "Tm-167", "Tm-168", "Tm-169", "Tm-170", "Tm-171", "Tm-172", "Tm-173", "Tm", "U-230", "U-231", "U-232", "U-233", "U-234", "U-235", "U-236", "U-237", "U-238", "U-240", "U (early)", "U (late)", "U", "Uuo", "Uup", "Uus", "Uut", "V-48", "V-49", "V-50", "V-51", "V", "W-176", "W-177", "W-178", "W-180", "W-181", "W-182", "W-183", "W-184", "W-185", "W-186", "W-187", "W-188", "W", "Xe-122", "Xe-123", "Xe-124", "Xe-125", "Xe-126", "Xe-127", "Xe-128", "Xe-129", "Xe-130", "Xe-131", "Xe-132", "Xe-133", "Xe-134", "Xe-135", "Xe-136", "Xe", "Y-86", "Y-87", "Y-88", "Y-89", "Y-90", "Y-91", "Y-92", "Y-93", "Y", "Yb-164", "Yb-166", "Yb-168", "Yb-169", "Yb-170", "Yb-171", "Yb-172", "Yb-173", "Yb-174", "Yb-175", "Yb-176", "Yb-177", "Yb-178", "Yb", "Zn-62", "Zn-64", "Zn-65", "Zn-66", "Zn-67", "Zn-68", "Zn-70", "Zn-72", "Zn", "Zr-86", "Zr-87", "Zr-88", "Zr-89", "Zr-90", "Zr-91", "Zr-92", "Zr-93", "Zr-94", "Zr-95", "Zr-96", "Zr-97", "Zr"];

var methods = ["Gamma", "ICP-MS", "NAA"];

var units = ["pct", "ppm", "ppb", "ppt", "ppq", "mBq/kg", "uBq/kg", "nBq/kg", "n/a"];

var types = [
  "Meas.", "Meas. (error)", "Meas. (asym. error)", 
  "Limit", "Limit (c.l.)", 
  "Range", "Range (c.l.)"
];

// ____________________________________________________________________________________
$(function(){

  // Set the appropriate logo
  $("#logo").attr("src", "images/" + db.name + ".png");
  
  // Tabs
  $( "#tabs" ).tabs({
    disabled: [ 1, 2 ]
  });

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

  //$("#myTable").tablesorter({ sortList: [[0, 0] [1, 0]] });

  // INPUT FORM TEMPLATE   

  $.get('templates/default_input.html', function(tmp) {               

    $.template("input_template", tmp);   
    $.tmpl("input_template", null).appendTo("#input-form");
    
    // Hide all results boxes except those for 'measurement, symmetric error'
    
    $(".rmeaserrp, .rmeaserrm").hide();
    $(".rlimit, .rlimitcl").hide();    
    $(".rrangel, .rrangeh, .rrangecl").hide();          

    // Spacers used to align results input boxes
    // This dynamic alignment ensures correct alignment in different browsers
    // Probably just have used a table...
    
    $(".spacer1").hide().attr('disabled', true);
    $(".spacer2").show().attr('disabled', true);
   
    // Tooltip positions     
     
    $("#tab-submit").children().tooltip({ 
      position: { my: "left+15 center", at: "right center" }
    });     
    $("#mdate2a").tooltip({ 
      position: { my: "left+157 center", at: "right center" } 
    });
    $("#sown1, #mreq1, #mprac1, #dinp1").tooltip({ 
      position: { my: "left+173 center", at: "right center" } 
    });
    $(".add-entry").tooltip({ 
      position: { my: "left+48 center", at: "right center" } 
    })

    // Date format switching
    
    $(".twodate").hide(); // Default to single date
    
    $("#button-date-sample").button({
      icons:{primary:"ui-icon-refresh"}, 
      text:false
    });
    
    $("#button-date-sample").live('click', function(){ 
    
      if ( $("#mdate1").is(":visible") && $("#mdate1").val() != "" ) {
        $("#mdate2a").val($("#mdate1").val()); 
      } else {
        $("#mdate1").val($("#mdate2a").val());     
      }
    
      $(".onedate").toggle();
      $(".twodate").toggle();        
  
      if ( $("#mdate1").is(":visible") ) {
        $("#mdate1").focus();  
      } else {
        $("#mdate2b").focus();     
      }
  
    });

    // Add result line button
    
    $(".add-entry").button({
      icons:{primary:"ui-icon-plus"},
      text:false
    })
    
    $(".add-entry").live('click', function(){     
      var clone = $(".input-template").clone(true)
        .removeClass('input-template').addClass('result-row');    
      clone.insertAfter($(this).closest('tr')).show();       
    });

    $(".remove-entry").button({
      icons:{primary:"ui-icon-minus"},
      text:false
    })
       
    $(".remove-entry").click(function(){   
      $(this).closest('tr').remove();
    })

    // Buttons for user-defined fields
    
    $(".button-user-add").button({
      icons:{primary:"ui-icon-plus"},
      text:false
    });
      
    $(".button-user-add").live('click', function(){
      var clone = $(".user-input-template").clone(true)
        .removeClass('user-input-template').addClass('row-user-sample');    
      clone.insertAfter($(this).closest('tr')).show();
      //$("#user-sample-null").hide();
    });

    $(".button-user-remove").button({
      icons:{primary:"ui-icon-minus"},
      text:false
    });

    $(".button-user-remove").click(function(){   
      $(this).closest('tr').remove();
    })

    // Form validation
        
    var validator = $("#input").validate({
       
      rules: {
        grp:       "required", 
        sname:     "required",  
        dref:      "required",
        dinp1:     "required",
        dinp2:     "required",
        dinp3:     "required"                
      }, 
                   
      messages: {
        grp:       "Required", 
        sname:     "Required",  
        dref:      "Required",
        dinp1:     "Required",
        dinp2:     "Required",
        dinp3:     "Required"    
      },
         
      errorPlacement: function(error, element) {
        error.appendTo(element.next('.istatus'));
      }      
       
    });   
        
  });

  // Autocomplete functions

  $(".risotope").live( 'focus', function() {
    $(this).autocomplete({source:isotopes, minLength:0});
    $(this).autocomplete('search', '');
  });

  $(".runit").live( 'focus', function() {
    $(this).autocomplete({source:units, minLength:0, 
      change: function (event, ui) {  
        if (!ui.item) { $(this).val(''); $(this).focus() }
      }
    });
    $(this).autocomplete('search', '');
  });
  
  $("#mtech").live( 'focus', function() {
    $(this).autocomplete({source:methods, minLength:0});
    $(this).autocomplete('search', '');
  });  

  // Handle change to result type
  
  $(".rtype").live('focus', function() {

    $(this).autocomplete({
      source:types, 
      minLength:0, 
      change: function (event, ui) {
        
        if (!ui.item) { $(this).val('Meas. (error)') }                  

        $(this).nextAll('.rmeas, .rmeaserr, .rmeaserrp, .rmeaserrm').hide();
        $(this).nextAll('.rlimit, .rlimitcl').hide();
        $(this).nextAll('.rrangel, .rrangeh, .rrangecl').hide();         

        var spacers = 1;
                    
        var cache_meas  = $(this).nextAll('.rmeas').val();
        var cache_limit = $(this).nextAll('.rlimit').val();     
                    
        if ( $(this).val() == "Meas." ) {
          
          $(this).nextAll('.rmeas').show().focus();
          if ( cache_limit != '' ) { $(this).nextAll('.rmeas').val(cache_limit) };
          spacers = 2;
    
        } else if ( $(this).val() == "Meas. (error)" ) {
    
          $(this).nextAll('.rmeas, .rmeaserr').show();
          $(this).nextAll('.rmeas').focus();
          if ( cache_limit != '' ) { $(this).nextAll('.rmeas').val(cache_limit) };          
    
        } else if ( $(this).val() == "Meas. (asym. error)" ) {
    
          $(this).nextAll('.rmeas, .rmeaserrp, .rmeaserrm').show();
          $(this).nextAll('.rmeas').focus();
          if ( cache_limit != '' ) { $(this).nextAll('.rmeas').val(cache_limit) };          
          spacers = 0;
    
        } else if ( $(this).val() == "Limit" ) {
    
          $(this).nextAll('.rlimit').show();
          $(this).nextAll('.rlimit').focus();
          if ( cache_meas != '' ) { $(this).nextAll('.limit').val(cache_meas) };          
          spacers = 2;
    
        } else if ( $(this).val() == "Limit (c.l.)" ) {
    
          $(this).nextAll('.rlimit, .rlimitcl').show();       
          $(this).nextAll('.rlimit').focus();
          if ( cache_meas != '' ) { $(this).nextAll('.limit').val(cache_meas) };           
    
        } else if ( $(this).val() == "Range" ) {
    
          $(this).nextAll('.rrangel, .rrangeh').show();      
          $(this).nextAll('.rrangel').focus();
    
        } else if ( $(this).val() == "Range (c.l.)" ) {
    
          $(this).nextAll('.rrangel, .rrangeh, .rrangecl').show();
          $(this).nextAll('.rrangel').focus();           
          spacers = 0;
    
        } else {
    
          $(this).val() == "Meas. (error)";
          $(this).nextAll('.rmeas, .rmeaserr').show();
          $(this).nextAll('.rmeas').focus();      
    
        }

        if ( spacers == 0 ) {
          $(this).nextAll(".spacer1").hide().attr('disabled', true);
          $(this).nextAll(".spacer2").hide().attr('disabled', true);                
        } else if ( spacers == 1 ) {
          $(this).nextAll(".spacer1").hide().attr('disabled', true);
          $(this).nextAll(".spacer2").show().attr('disabled', true);
        } else {
          $(this).nextAll(".spacer1").show().attr('disabled', true);
          $(this).nextAll(".spacer2").show().attr('disabled', true);
        }         

      }});
      
    $(this).autocomplete('search', '');    

  });
       
  // DISPLAY TEMPLATE
  
  $.get('templates/default_output.html', function(tmp) {               
    $.template("output_template", tmp);   
  });
      
  $("#button-search").button({icons:{primary: "ui-icon-search"},text:false});

  $("#button-expand").button();   
  $("#button-detail").button();   

  $("#button-clear1").button();   
  $("#button-clear2").button();
  $("#button-check").button();   
  $("#button-submit").button();  

  $("#dialog-submit").dialog({ autoOpen: false, modal: true, resizable: false });   

  $("input:text:visible:first").focus();
  
});

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

    // Build the JSON for the results block
      
    var result = {};

    $(".results-block").children('div.result-row').each(function(i) {

      console.log($(this).find(".risotope").val());

/*         
      // Loop through all the results for this measurement
         
      var iisotope = $(this).find(".risotope").val();
      var iselect  = $(this).find(".iselect").val();
      var ivalue   = $(this).find(".ivalue").val();
      var ierror   = $(this).find(".ierror").val();         
      var iunit    = $(this).find(".iunit").val();  
        console.log(iisotope); 
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
*/         

    });
      
    // Build the overall JSON
     
    var output_json =  {

      "type":              "measurement",

      "grouping":          $("#grp").val(),
      
      "sample": {
        
        "name":            $("#sname").val(),
        "description":     $("#sdesc").val(),
        "id":              $("#sid").val(),
        "source":          $("#ssrc").val(),
        "owner": {
          "name":          $("#sown1").val(),
          "contact":       $("#sown2").val()
        }

      },
        
      "measurement": {

        "institution":     $("#minst").val(),
        "technique":       $("#mtech").val(),
        "description":     $("#mdesc").val(),        
        "date":           [$("#mdate").val()],
        "results":         result,
        "requestor":  {
          "name":          $("#mreq1").val(),
          "contact":       $("#mreq2").val()
        },
        "practitioner":  {
          "name" :         $("#mprac1").val(),
          "contact":       $("#mprac2").val()
        },
        "description":     $("#mdesc").val()
      },

      "data_source": {
         "reference":      $("#dref").val(),
         "input" : {
           "name":         $("#dinp1").val(),
           "contact":      $("#dinp2").val(),
           "date":         $("#dinp3").val()
         },
         "notes" :         $("#dnotes").val()
      },
      "specification" : "2.02"

    };
 
     db.saveDoc(
    
       output_json,

        { success: function() {

          $( "#dialog-submit" ).dialog({
            modal: true,
            buttons: {
              "Clear": function() {
                $(this).dialog("close");
                click_clear_all();
              },
              "Keep": function() {
                $(this).dialog("close");
              }
            }
          });           
             
          $( "#dialog-submit" ).dialog("open" );
          
        }}

      );

   } 

}

// ____________________________________________________________________________________
function click_search() {
  
  var entry = $("#box-search").val();

  if ( entry == "" || entry == "e.g. all") {
    $("#box-search").focus();    
    $("#materials").empty(); 
    $("#status-line").empty(); 
    return false;
  }    
         
  searchResults($("#box-search").val()); 
          
  return false;

}; 

// ____________________________________________________________________________________
function searchResults(val) {

  $("#materials").empty();
  $("#status-line").empty();

  val = val.toLowerCase();

  var max_entries;
  var n_entries;

  var search_url; 

  if ( window.location.host.split(".")[1] == "cloudant" ) {      
    search_url = window.location.protocol + '//' + window.location.host 
               + '/' + dbname + '/_design/persephone/_search/assays?q=' 
               + val + '&include_docs=true&limit=100';
    max_entries = 100;                  
  }
    
  if ( val == "all" ) {
    search_url = '/' + dbname + '/_all_docs?limit=25&include_docs=true&descending=true';
    max_entries = 25;
  };
   
  $.ajax({ 
        
    url: search_url,
    dataType: 'json',
    async: false,
    success: function(data) { 

      if ( data.total_rows > 0 ) {

        if ( data.total_rows > max_entries ) {
          n_entries = max_entries;
          $("#status-line").append('Output limited to ' + max_entries + ' entries');        
        } else {         
          n_entries = data.total_rows;                 
        };
      
        for ( j = 0; j < n_entries; j++ ) {  

          var doc = data.rows[j].doc;

          if ( doc.type == "measurement" ) {  ;
            var tt = $.tmpl("output_template", doc);
            $("#materials").append(tt);
            
          }
   
        }
  
        $(".hideable").hide();
  
        $("#materials > div").accordion({ 
          header: "h3", 
          navigation: true, 
          collapsible:true, 
          heightStyle: "content",
          create: function(event) { 
            $(event.target).accordion( "activate", false ); 
          } 
        });
        
        $( "#materials" ).sortable({axis: "y",
        handle: "h3"});

        $(".delete-button").button({
          icons:{primary:"ui-icon-close"},
          text:false
        })    
      
        $( ".delete-button" ).click(function(event){
          event.stopPropagation(); // this is
          event.preventDefault(); // the magic
          var parent = $(this).closest('div');
          var head = parent.prev('h3');
          
          
          parent.add(head).hide(function(){$(this).remove();});
        });

        $(".detail-button").button({
          icons:{primary:"ui-icon-zoomin"},
          text:false
        })    
      
        $(".detail-button" ).click(function(event){
          event.stopPropagation(); // this is
          event.preventDefault(); // the magic
          var parent = $(this).closest('div');
          parent.find('.hideable').toggle();
          $(".ui-button-icon-primary", this)
            .toggleClass("ui-icon-zoomin ui-icon-zoomout");         
        });
        
        $(".detail-button" ).hide();

        $("h3").click(function() {
          var parent = $(this).closest('div');
          parent.find('.detail-button').fadeToggle();
        });
        
      }
      
    }
      
  })

};

// ____________________________________________________________________________________
function enter_box(event) {    
  
  if (event.keyCode == 13) {
      
    //$( "#box-search" ).autocomplete("close");
    click_search();
    event.returnValue = false; // for IE
    if (event.preventDefault()) event.preventDefault(); 
   
  }

  return false;     
        
}  

// ____________________________________________________________________________________
function email_link(user, dom, linkText) {
  
 return document.write( "<a href=" + "mail" + "to:" + user + "@" + dom
   + ">" + linkText + "<\/a>" );

}







