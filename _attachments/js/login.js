// Copyright Chris Anderson 2011
// Revised by Zheng Li
$(document).ready(function(){
	$("#contactLink").click(function(){
		if ($("#contactForm").is(":hidden")){
			$("#contactForm").slideDown("slow");
		}
		else{
			$("#contactForm").slideUp("slow");
		}
	});
	
});

function closeForm(){
	$("#messageSent").show("slow");
	setTimeout('$("#messageSent").hide();$("#contactForm").slideUp("slow")', 2000);
}

(function($) {
	$.fn.couchLogin = function(opts) {
		var elem = $(this);
		opts = opts || {};
		function initWidget() {
			$.couch.session({
				success : function(r) {
					var userCtx = r.userCtx;
					if (userCtx.name) {
						elem.empty();
						elem.append(loggedIn(r));
						if (opts.loggedIn) {opts.loggedIn(userCtx)}
					} else if (userCtx.roles.indexOf("_admin") != -1) {
						elem.html(templates.adminParty);
					} else {
						elem.html(templates.loggedOut);
						if (opts.loggedOut) {opts.loggedOut()}
					};
				}
			});
		};
		initWidget();
		function doLogin(name, pass) {
			$.couch.login({name:name, password:pass, success:initWidget});
		};
		elem.delegate("a[href=#login]", "click", function() {
			elem.html(templates.loginForm);
			elem.find('input[name="name"]').focus();
		});
		elem.delegate("a[href=#logout]", "click", function() {
			$.couch.logout({success : initWidget});
		});
		elem.delegate("form.login", "submit", function() {
			doLogin($('input[name=name]', this).val(),  
				$('input[name=password]', this).val());
			return false;
		});
	}
	var templates = {
		adminParty : '<p><strong>Admin party, everyone is admin!</strong> Fix this in <a href="/_utils/index.html">Futon</a> before proceeding.</p>',
		loggedOut : '<a href="#login">Login</a>',
		loginForm : '<form class="login"><label for="name">Name</label><input type="text" name="name" class="ui-widget ui-widget-content ui-corner-all"/><label for="password">Password</label><input type="password" name="password" class="ui-widget ui-widget-content ui-corner-all"/><input type="submit" value="" id="login-submit"></form>',
	};
	function loggedIn(r) {
		var auth_db = encodeURIComponent(r.info.authentication_db)
		, uri_name = encodeURIComponent(r.userCtx.name)
		, span = $('<span>Welcome <a target="_new" href="/_utils/document.html?' 
			+ auth_db +'/org.couchdb.user%3A' + uri_name 
			+ '" class="name"></a>! <a href="#logout">Logout?</a></span>');
		$('a.name', span).text(r.userCtx.name); // you can get the user name here
		return span;
	}
})(jQuery);
