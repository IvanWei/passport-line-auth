exports.options = {
  useAuthorizationHeaderforGET: true,
  authorizationURL: 'https://access.line.me/oauth2/v2.1/authorize',
  tokenURL: 'https://api.line.me/oauth2/v2.1/token',
  profileURL: 'https://api.line.me/v2/profile',
  scope: ['profile', 'openid'],
  botPrompt: null, //normal / aggressive
  uiLocales: null, // ref: https://gist.github.com/msikma/8912e62ed866778ff8cd
};
