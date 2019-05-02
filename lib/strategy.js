var OAuth2Strategy = require('passport-oauth2'),
    util = require('util'),
    uri = require('url'),
    InternalOAuthError = OAuth2Strategy.InternalOAuthError,
    lineAuthorizationError = require('./errors/lineAuthorizationError')
    defaultOptions = require('./options').options;

function Strategy(_options, verify) {
  if (!_options.channelID) {
    throw new Error('Channel\'s Id must be setting');
  }

  if (!_options.channelSecret) {
    throw new Error('Channel\'s Secret must be setting');
  }
  delete _options.state;

  var options = Object.assign({}, _options || {});
  delete options.botPrompt;
  options.clientID = _options.channelID;
  options.clientSecret = _options.channelSecret;
  options.scopeSeparator = ' ';
  options.state = true;
  options.botPrompt = _options.botPrompt || defaultOptions.botPrompt;
  options.scope = _options.scope || defaultOptions.scope;

  options.authorizationURL = options.authorizationURL || defaultOptions.authorizationURL;
  options.tokenURL = options.tokenURL || defaultOptions.tokenURL;

  OAuth2Strategy.call(this, options, verify);
  this.name = 'line';
  this._profileURL = options.profileURL || defaultOptions.profileURL;
  this._clientId = options.clientID;
  this._clientSecret = options.clientSecret;
  this._botPrompt = options.botPrompt;

  // this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter (By node-oauth)
  // Use Authorization Header (Bearer with Access Token) for GET requests. Used to get User's profile.
  this._oauth2.useAuthorizationHeaderforGET(defaultOptions.useAuthorizationHeaderforGET);
}

Strategy.prototype.authenticate = function(req, options) {
  if (req.query && req.query.error_code && !req.query.error) {
    return this.error(new lineAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
  }

  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

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
      profile.pictureUrl = json.pictureUrl;

      profile._raw = body;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};

Strategy.prototype.authorizationParams = function(_options) {
  var options = Object.assign({}, _options || {});

  if (this._botPrompt === 'normal' || this._botPrompt === 'aggressive') {
    options.bot_prompt = this._botPrompt;
  }

  return options;
};

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

module.exports = Strategy;
