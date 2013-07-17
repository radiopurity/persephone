// Copyright Chris Anderson 2011
// Revised by Zheng Li
$(document).ready(function(){

	$("#contactForm").couchLogin({
		loggedIn : function() {
			// Tabs
			$( "#tabs" ).tabs({disabled: [] });
			// close the login tab
			setTimeout('$("#contactForm").slideUp("slow")', 2000);
		}, 
		loggedOut : function() {
        	// Tabs
			$( "#tabs" ).tabs({disabled: [ 1 , 2] });
    	}
	});

	$("#contactLink").click(function(){
		if ($("#contactForm").is(":hidden")){
			$("#contactForm").slideDown("slow");
		}
		else{
			$("#contactForm").slideUp("slow");
		}
	});
	
});

// CouchDB login
(function($) {
	$.fn.couchLogin = function(opts) {
		loginForm = '<fieldset> <label for="name">Name</label> <input id="login-name" type="text" /> <label for="password">Password</label> <input id="login-password" type="password" /> <input id="login-button" value="Login" type="submit" name="submit"/> </fieldset>';

		var elem = $(this);
		opts = opts || {};

		function loggedIn(r) {
			var auth_db = encodeURIComponent(r.info.authentication_db)
			, uri_name = encodeURIComponent(r.userCtx.name)
			, span = $('<span id="welcome"><br><br><br>Welcome, '+ r.userCtx.name +'<br><br><a href="#logout">Logout?</a></span>');
			return span;
		}
	
		function initWidget() {
				$.couch.session({
					success : function(r) {
						var userCtx = r.userCtx;
						if (userCtx.name) {

							$("#contactForm").empty();

							elem.append(loggedIn(r));

							if (opts.loggedIn) {opts.loggedIn()}
						}else{

							$("#contactForm").empty();
							
							elem.append(loginForm);
	
							if (opts.loggedOut) {opts.loggedOut()}
						}
					}
				});
			};
	
		function doLogin(name, pass) {
			$.couch.login({name:name, password:pass, success:initWidget});
		};


		initWidget();

		elem.delegate("a[href=#logout]", "click", function() {
			$.couch.logout({success : initWidget});
		});

		elem.delegate("#login-button", "click", function() {
			doLogin($('#login-name').val() , $('#login-password').val());
			return false;
		});
	}
})(jQuery);
