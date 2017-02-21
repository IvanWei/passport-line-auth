# passport-line-auth

## Install

```
$ npm install passport-line-auth
```

## Parameter

```
passport.use(new LineStrategy({
    channelID: LINE_CHANNEL_ID,
    channelSecret: LINE_CHANNEL_SECRET,
    callbackURL: "http://localhost:3000/auth/line/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ lineId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```
