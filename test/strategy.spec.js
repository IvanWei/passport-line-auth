import http from 'http';
import test from 'ava';
import passport from 'passport';

import LineStrategy from '../lib';

test('[Pass] Constructed Passport for LINE', (t) => {
  const strategy = new LineStrategy({
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
  }, () => {});

  t.is(strategy.name, 'line');
  t.is(typeof strategy._oauth2, 'object');
  t.is(strategy._oauth2._clientId, 'fakeId');
  t.is(strategy._oauth2._clientSecret, 'fakeSecret');
});

test('[Failure] Constructed with missing for channelID', (t) => {
  t.throws(() => {
    new LineStrategy({
      channelSecret: 'failure',
      callbackURL: 'http://failure.domain',
    }, () => {});
  }, 'Channel\'s Id must be setting');
});

test('[Failure] Constructed with missing for channelSecret', (t) => {
  t.throws(() => {
    new LineStrategy({
      channelID: 'failure',
      callbackURL: 'http://failure.domain',
    }, () => {});
  }, 'Channel\'s Secret must be setting');
});

test('[Failure] Constructed with missing for something', (t) => {
  t.throws(() => {
    new LineStrategy({
      channelID: 'failure',
      channelSecret: 'failure',
      callbackURL: 'http://failure.domain',
    });
  }, 'OAuth2Strategy requires a verify callback');
});

test('[Pass] Checked authenticate', (t) => {
  let req = new http.IncomingMessage();
  const self = {
    error: function(error) {return error;},
    _oauth2: {
      _authorizeUrl: 'http://test.com',
      _accessTokenUrl: 'http://test.com',
      _clientId: 'fakeId',
    },
  }
  const options = {
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
    botPrompt: 'null'
  };

  const strategy = new LineStrategy(options, () => {});
  self.authorizationParams = strategy.authorizationParams;
  const response = strategy.authenticate.bind(self, req, options)(req, options);

  t.is(response, undefined);
});


test('[Pass] Checked authenticate, skip state on options', (t) => {
  let req = new http.IncomingMessage();
  const self = {
    error: function(error) {return error;},
    _oauth2: {
      _authorizeUrl: 'http://test.com',
      _accessTokenUrl: 'http://test.com',
      _clientId: 'fakeId',
    },
  }
  const options = {
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
    state: 'test',
    botPrompt: 'null'
  };

  const strategy = new LineStrategy(options, () => {});
  self.authorizationParams = strategy.authorizationParams;
  const response = strategy.authenticate.bind(self, req, options)(req, options);

  t.is(response, undefined);
});

test('[Failure] Checked authenticate', (t) => {
  let req = new http.IncomingMessage();
  req.query = {
    error_code: 500,
    error_message: 'test',
  };

  const self = {
    error: function(error) {return error;},
  }
  const options = {
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
    botPrompt: 'null'
  };

  const strategy = new LineStrategy(options, () => {});
  const response = strategy.authenticate.bind(self, req, options)(req, options);

  t.true(response instanceof Error);
});

test('Set authorization params (botPrompt: null)', (t) => {
  const options = {
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
    botPrompt: 'null'
  };

  const strategy = new LineStrategy(options, () => {});
  const newOptions = strategy.authorizationParams(options);

  t.is(newOptions.bot_prompt, undefined);
});

test('Set authorization params (botPrompt: normal)', (t) => {
  const options = {
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
    botPrompt: 'normal'
  };

  const strategy = new LineStrategy(options, () => {});
  const newOptions = strategy.authorizationParams(options);

  t.is(newOptions.bot_prompt, options.botPrompt);
});

test('[Pass] Loading user profile (No email)', (t) => {
  const response = {
    provider: 'line',
    userId: '12345',
    displayName: 'fake name',
    pictureUrl: 'https://goo.gl/2Hm9pY',
  };

  let strategy = new LineStrategy({
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
  }, () => {});

  strategy._oauth2.get = (url, accessToken, cb) => {
    cb(null, JSON.stringify(response));
  };

  strategy.userProfile('token', (err, profile) => {
    t.is(profile.provider, response.provider);
    t.is(profile.id, response.userId);
    t.is(profile.displayName, response.displayName);
    t.is(profile.pictureUrl, response.pictureUrl);
  });
});

test('[Failure] Loading user profile, then data was an object', (t) => {
  let strategy = new LineStrategy({
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
  }, () => {});

  strategy._oauth2.get = (url, accessToken, cb) => {
    cb(new Error('Failure'));
  };

  strategy.userProfile('token', (err, profile) => {
    t.true(!!err);
    t.is(profile, undefined);
  });
});

test('[Failure] Loading user profile (No email)', (t) => {
  const response = {
    provider: 'line',
    userId: '12345',
    displayName: 'fake name',
    pictureUrl: 'https://goo.gl/2Hm9pY',
  };

  let strategy = new LineStrategy({
    channelID: 'fakeId',
    channelSecret: 'fakeSecret',
    callbackURL: 'http://fake.domain',
  }, () => {});

  strategy._oauth2.get = (url, accessToken, cb) => {
    cb(null, response);
  };

  strategy.userProfile('token', (err, profile) => {
    t.true(!!err);
    t.is(profile, undefined);
  });
});
