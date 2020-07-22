const bcrypt = require('bcrypt');
const User = require('../../database/user-schema');

const getAuth = require('../auth');
const { resp, next } = require('./mock-express');

const req = {
  body: {
    email: 'authTest@localhost',
    password: 'save123',
  },
};
const userTest = {
  email: 'authTest@localhost',
  password: bcrypt.hashSync('save123', 10),
};

describe('Auth', () => {
  beforeAll(async () => {
    await new User(userTest).save();
  });
  it('should get a token', async () => {
    const result = await getAuth(req, resp, next);
    expect(result.token).toBeDefined();
  });
  it('should not get a token when there is no password or email', async () => {
    const req1 = {
      body: {
        email: 'authTest@localhost',
      },
    };
    const req2 = {
      body: {
        password: 'save123',
      },
    };
    const result1 = await getAuth(req1, resp, next);
    const result2 = await getAuth(req2, resp, next);
    expect(result1).toBe(400);
    expect(result2).toBe(400);
  });
  it('should throw a 404 when the user is not found', async () => {
    const req = {
      body: {
        email: 'fake-email@localhost',
        password: 'save123',
      },
    };
    const result = await getAuth(req, resp, next);
    expect(result).toBe(404);
  });
  it('should throw a 403 when the password is wrong', async () => {
    const req = {
      body: {
        email: 'authTest@localhost',
        password: 'save111',
      },
    };
    const result = await getAuth(req, resp, next);
    expect(result).toBe(403);
  });
});
