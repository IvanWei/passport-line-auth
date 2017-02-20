// Load modules.
var OAuth2Strategy = require('passport-oauth2'),
    util = require('util'),
    uri = require('url'),
    shortid = require('shortid'),
    InternalOAuthError = OAuth2Strategy.InternalOAuthError,
    LineAuthorizationError = require('./errors/lineAuthorizationError');

function Strategy(options, verify) {
  options = options || {};
  options.clientID = options.channelID;
  options.clientSecret = options.channelSecret;
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {}

  // Delete Clannel ID and Secret.
  delete options.channelID;
  delete options.channelSecret;

  options.authorizationURL = options.authorizationURL || 'https://access.line.me/dialog/oauth/weblogin';
  options.tokenURL = options.tokenURL || 'https://api.line.me/v2/oauth/accessToken';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'line';
  this._profileURL = options.profileURL || 'https://api.line.me/v2/profile';
  this._profileFields = options.profileFields || null;
  this._clientID = options.clientID;
  this._clientSecret = options.clientSecret;

  // Use Authorization Header (Bearer with Access Token) for GET requests. Used to get User's profile.
  this._oauth2.useAuthorizationHeaderforGET(true);
}

Strategy.prototype.authenticate = function(req, options) {

  if (req.query && req.query.error_code && !req.query.error) {
    return this.error(new LineAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
  }

  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

Strategy.prototype.authorizationParams = function (options) {
  var params = {};

  // https://developers.facebook.com/docs/reference/dialogs/oauth/
  // if (options.display) {
  //   params.display = options.display;
  // }

  // // https://developers.facebook.com/docs/facebook-login/reauthentication/
  // if (options.authType) {
  //   params.auth_type = options.authType;
  // }
  // if (options.authNonce) {
  //   params.auth_nonce = options.authNonce;
  // }

  return params;
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
