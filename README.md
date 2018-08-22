# passport-line-auth

[![Build Status](https://travis-ci.org/IvanWei/passport-line-auth.svg?branch=master)](https://travis-ci.org/IvanWei/passport-line-auth)
[![codecov](https://codecov.io/gh/IvanWei/passport-line-auth/branch/master/graph/badge.svg)](https://codecov.io/gh/IvanWei/passport-line-auth)
[![Greenkeeper badge](https://badges.greenkeeper.io/IvanWei/passport-line-auth.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/passport-line-auth.png)](https://nodei.co/npm/passport-line-auth/)

[![Package Quality](http://npm.packagequality.com/badge/passport-line-auth.png)](http://packagequality.com/#?package=passport-line-auth)

Passport strategy for authenticating with LINE using the OAuth 2.0 API and OpenID Connect.

## How to Install
### npm

```
npm install passport-line-auth --save
```

### Yarn

```
yarn add passport-line-auth
```

## Usage

### Create an Service

Before using passport-line-auth, you must register an Services with LINE. If you have not already done so, a new services can be created at [LINE Developers](https://developers.line.me/console/register/line-login/provider/). Your service will be issued an channel ID and channel secret, which need to be provided to the strategy. You will also need to configure a redirect URI which matches the route in your service.

### Configure Strategy

The LINE authentication strategy authenticates users using a LINE account and OAuth 2.0 tokens. The channel ID and secret obtained when creating an service are supplied as options when creating the strategy. The strategy also requires a `verify` callback, which receives the access token and optional refresh token, as well as `profile` which contains the authenticated user's LINE profile. The `verify` callback must call `cb` providing a user to complete authentication.

- [Part 1] Sample Code
```
passport.use(new LineStrategy({
    channelID: LINE_CHANNEL_ID,
    channelSecret: LINE_CHANNEL_SECRET,
    callbackURL: "http://localhost:3000/auth/line/callback",
    scope: ['profile', 'openid'],
    botPrompt: 'normal'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ lineId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

- [Part 2] Sample Code
```
passport.use(new LineStrategy({
    channelID: LINE_CHANNEL_ID,
    channelSecret: LINE_CHANNEL_SECRET,
    callbackURL: "http://localhost:3000/auth/line/callback",
    scope: ['profile', 'openid', 'email'],
    botPrompt: 'normal'
  },
  function(accessToken, refreshToken, params, profile, cb) {
    var email = jwt.decode(params.id_token)
    User.findOrCreate({ lineId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

### Options

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| channelID | String | Required | | Channel's Id by LINE |
| channelSecret | String | Required | | Channel's secret by LINE |
| callbackURL | String | Required | | URL that users are redirected to after authentication and authorization. Must match one of the the callback URLs registered for your channel in the [console](https://developers.line.me/console/). |
| scope | Array | Required | `['profile', 'openid']` | Permissions granted by the user. Set value to either profile, openid or email. If  |
| botPrompt | String | Optional | 'null' | Displays an option to add a bot as a friend during login. Set value to either normal or aggressive. For more information, see [Linking a bot with your LINE Login channel](https://developers.line.me/en/docs/line-login/web/link-a-bot). |

### Response

| Name | Type| Description |
|---|---|---|
| accessToken | String | Access token. Valid for 30 days. |
| refreshToken | String | Token used to get a new access token. Valid up until 10 days after the access token expires. |
| idToken | String | JWT that includes information about the user. This field is returned only if `openid` is specified in the scope. For more information, see [ID tokens](https://developers.line.me/en/docs/line-login/web/integrate-line-login/#id-tokens). |

### Exmaple

First time, you need set channel id, secret and redirect uri at [Exmaple](https://github.com/IvanWei/passport-line-auth/blob/master/example/app.js), then install packages and `npm start`.

## Reference

- [passport-oauth2](https://github.com/jaredhanson/passport-oauth2)
- [passport-facebook](https://github.com/jaredhanson/passport-facebook)
- [LINE Web Login](https://developers.line.me/en/docs/line-login/web/integrate-line-login/)

## License

[The MIT License](https://raw.githubusercontent.com/ivanwei/passport-line-auth/master/LICENSE)

Copyright(c)2018 Ivan Wei <[https://blog.ivanwei.co/](https://blog.ivanwei.co/)>
