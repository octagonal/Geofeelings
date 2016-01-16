module.exports = {

  isAuthenticated: function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    console.log("user is logged in");
    if (req.isAuthenticated())
      return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
  },

  isUserAdmin: function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    console.log("user is admin");
    if (req.user.username == "octocat")
      return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
  }

}
