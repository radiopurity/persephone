/** Highlight email and web link. */
jQuery.fn.highlight = function(method) {
  if (method === 'email') {
    var expression = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  } else {
    var expression = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\(\)\w\.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi
  }
  var regex = new RegExp(expression);
  return this.each(function () {
    $(this).contents().filter(function() {
      return this.nodeType == 3 && this.nodeValue.match(regex);
    }).replaceWith(function() {
      return (this.nodeValue || '').replace(regex, function(match) {
        if (method === 'email') {
          return '<a href=\"mailto:' + match +
                 '" target="_blank">' + match + '</a>';
        } else {
          return "<a href=\"" + match +
                 "\" target=\"_blank\">" + match + "</a>";
        }
      });
    });
  });

};

/** infiniScroll plugin - credit? */
(function( $ ){
  var _checkLevel = function() {

    // if it's low enough, grab latest data
    if (!_levelReached() || getSelectedTabIndex() != 0){
      return methods.pollLevel();
    } else {
      var moreresult = new Boolean(0);
      var url;

      if(skip + localSettings.max_entries < totalRows){
        moreresult = new Boolean(1);
        skip = skip + localSettings.max_entries;
        url = searchURL + "&skip=" + skip;
      }
      if(val != "all" && val != "All"){
        url = searchURL + "&bookmark=" + bookmark;
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

            var i, doc, material = $("#materials");

            for ( i in data.rows ) {
              if (val != "all" && val != "All"){
                      doc = data.rows[i].fields;
                      doc["id"] = data.rows[i].id;
              } else {
                      doc = data.rows[i].value;
              }
              fillHeading(doc, material);
            }
            decorateResult();
            methods.pollLevel();
            }
          });
        }
      }
  };

  var _setLastID = function(elem, lastID){
    elem.data("lastID", lastID);
  };

  var _levelReached = function(){
    // is it low enough to add elements to bottom?
    var pageHeight = Math.max(document.body.scrollHeight ||
                              document.body.offsetHeight);
    var viewportHeight = window.innerHeight ||
                         document.documentElement.clientHeight   ||
                         document.body.clientHeight || 0;
    var scrollHeight = window.pageYOffset ||
                       document.documentElement.scrollTop      ||
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
    'interval' : 500
    ,'loading_elem' : 'spinner'
    ,'num' : 5
    ,'sort' : 'desc'
  };

  $.fn.infiniScroll = function(method) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +    method + ' does not exist on jQuery.infiniScroll' );
    }
  }

})( jQuery );





/** Comment. */
(function($) {
  $.fn.couchLogin = function(opts) {

    loginForm = '<input id="login-name" class="ui-widget-content" '
              +   'type="text" placeholder="User ID"/>'
              + ' <input id="login-password" class="ui-widget-content" '
              +   'type="password" placeholder="Password"/>'
              + ' <input id="login-button" value="Login" '
              +   'type="submit" name="submit"/>';
    var elem = $(this);
    opts = opts || {};

    function loggedIn(r) {
      var auth_db = encodeURIComponent(r.info.authentication_db)
      , uri_name = encodeURIComponent(r.userCtx.name)
      , span = $('<span id="welcome">Currently logged in as '
      + r.userCtx.name
      + '<br><br><input id="logout-button" value="Logout" '
      + 'type="submit"/></span>');
      return span;
    }

    function initWidget() {
      $.couch.session({
        success : function(r) {
          var userCtx = r.userCtx;
          if (userCtx.name) {
            $("#contactForm").empty();
            elem.append(loggedIn(r));
            $("#logout-button").button()
            if (opts.loggedIn) {opts.loggedIn()}
          } else {
            $("#contactForm").empty();
            elem.append(loginForm);
            $("#login-button").button()
            if (opts.loggedOut) {opts.loggedOut()}
          }
        },
        error : function(){
          // FIXME
        }
    });
  };

  function doLogin(name, pass) {
    $.couch.login({name:name, password:pass, success:initWidget});
  };

  initWidget();

  elem.delegate("#logout-button", "click", function() {
    $.couch.logout({success : initWidget});
  });

  elem.delegate("#login-button", "click", function() {
    doLogin($('#login-name').val() , $('#login-password').val());
    return false;
  });

  }
})(jQuery);
