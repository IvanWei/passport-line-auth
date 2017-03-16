# passport-line-auth

Passport strategy for authenticating with LINE using the OAuth 2.0 API.

## Install

```
$ npm install passport-line-auth
```

## Usage

### Create an Service

Before using passport-line-auth, you must register an Services with LINE. If you have not already done so, a new services can be created at [LINE Business Center](https://business.line.me/zh-hant/). Your service will be issued an channel ID and channel secret, which need to be provided to the strategy. You will also need to configure a redirect URI which matches the route in your service.

### Configure Strategy

The LINE authentication strategy authenticates users using a LINE account and OAuth 2.0 tokens. The channel ID and secret obtained when creating an service are supplied as options when creating the strategy. The strategy also requires a `verify` callback, which receives the access token and optional refresh token, as well as `profile` which contains the authenticated user's LINE profile. The `verify` callback must call `cb` providing a user to complete authentication.

```
passport.use(new LineStrategy({
    channelID: LINE_CHANNEL_ID,
    channelSecret: LINE_CHANNEL_SECRET,
    useAutoLogin: true, // Default true
    callbackURL: "http://localhost:3000/auth/line/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ lineId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

## Reference

- [passport-oauth2](https://github.com/jaredhanson/passport-oauth2)
- [passport-facebook](https://github.com/jaredhanson/passport-facebook)
- [LINE Web Login](https://developers.line.me/web-api/integrating-web-login-v2)

## License

[The MIT License](https://raw.githubusercontent.com/ivanwei/passport-line-auth/master/LICENSE)

Copyright (c) 2017 Ivan Wei <[https://blog.ivanwei.co/](https://blog.ivanwei.co/)>
