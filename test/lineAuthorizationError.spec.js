import test from 'ava';

import lineAuthorizationError from '../lib/errors/LineAuthorizationError';

test('Build error\'s object', (t) => {
  const customError = new lineAuthorizationError('test', 500);
  t.true(customError instanceof Error);
});
