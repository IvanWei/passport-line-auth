// Load modules.
var OAuth2Strategy = require('passport-oauth2'),
    shortid = require('shortid'),
    util = require('util'),
    uri = require('url'),
    InternalOAuthError = OAuth2Strategy.InternalOAuthError,
    LineAuthorizationError = require('./errors/lineAuthorizationError')
    defaultOptions = require('./options').options;

function Strategy(options, verify) {
  options = options || {};
  options.clientID = options.channelID;
  options.clientSecret = options.channelSecret;
  options.useAutoLogin = options.useAutoLogin || true;
  options.scopeSeparator = options.scopeSeparator || ' ';
  options.customHeaders = options.customHeaders || {};
  options.scope = (options.scope || defaultOptions.scope).reduce(function(result, v){
    if (result.indexOf(v) >= 0) return result;
    return result.concat(v);
  }, []);

  if (options.useAutoLogin) options.state = shortid.generate();

  // Delete Clannel ID and Secret.
  delete options.channelID;
  delete options.channelSecret;

  options.authorizationURL = options.authorizationURL || defaultOptions.authorizationURL;
  options.tokenURL = options.tokenURL || defaultOptions.tokenURL;

  // https://developers.line.me/web-api/integrating-web-login-v2#guidance_to_login_screen
  // if (options.useAutoLogin) options.authorizationURL += '?state=' + shortid.generate();

  OAuth2Strategy.call(this, options, verify);
  this.name = 'line';
  this._profileURL = options.profileURL || defaultOptions.profileURL;
  this._profileFields = options.profileFields || null;
  this._clientID = options.clientID;
  this._clientSecret = options.clientSecret;

  // this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter (By node-oauth)
  // Use Authorization Header (Bearer with Access Token) for GET requests. Used to get User's profile.
  this._oauth2.useAuthorizationHeaderforGET(defaultOptions.useAuthorizationHeaderforGET);
}

Strategy.prototype.authenticate = function(req, options) {

  if (req.query && req.query.error_code && !req.query.error) {
    return this.error(new LineAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
  }

  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  var url = uri.format(uri.parse(this._profileURL));

  this._oauth2.get(url, accessToken, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'line' };
      profile.id = json.userId;
      profile.displayName = json.displayName;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};

module.exports = Strategy;
