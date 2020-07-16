const mongoose = require('mongoose');
const { MockMongoose } = require('mock-mongoose');

const mockMongoose = new MockMongoose(mongoose);
const bcrypt = require('bcrypt');
const {
  getUsers,
  getOneUser,
  addUser,
  deleteUser,
  updateUser,
} = require('../../controller/users');
const { connectToDB } = require('../../database/db-connect');
const User = require('../../database/user-schema');
// npx jest -t getUsers
const resp = {
  json: (obj) => obj,
  status(responseStatus) {
    this.statusCode = responseStatus;
    return this;
  },
};
const userAddedReq = {
  body: {
    email: 'test@localhost',
    password: 'changeme',
    roles: {
      admin: false,
    },
  },
};
const failedReq = {
  body: {
    email: 'error@localhost',
  },
  params: {
    uid: 'error@localhost',
  },
};
const next = (number) => number;
const userData = {
  email: 'test2@localhost',
  password: bcrypt.hashSync('', 10),
  roles: {
    admin: false,
  },
};
describe('Users', () => {
  beforeAll((done) => {
    mockMongoose.prepareStorage().then(() => {
      connectToDB('mongodb://127.0.0.1/BurguerQueen').then(() => {
        new User(userData).save((err, result) => {
          if (result) {
            done();
          }
        });
      });
    });
  });
  it('should add a user to the colection', async (done) => {
    const result = await addUser(userAddedReq, resp, next);
    expect(result.email).toBe('test@localhost');
    expect(result.password).toBeUndefined();
    expect(result.roles.admin).toBeFalsy();
    done();
  });
  it('should not add a user to the colection and return 400', async (done) => {
    const result = await addUser(failedReq, resp, next);
    expect(result).toBe(400);
    done();
  });
  it('should get users collection', async (done) => {
    const req = {
      query: {},
    };
    delete userData.password;
    delete userAddedReq.body.password;
    const result = await getUsers(req, resp, next);
    delete result[0]._doc._id;
    delete result[0]._doc.__v;
    delete result[1]._doc._id;
    delete result[1]._doc.__v;
    const newResult = [result[0]._doc, result[1]._doc];
    expect(newResult).toEqual([userData, userAddedReq.body]);
    done();
  });
  it('should get user requested with email: test2@localhost', async (done) => {
    const req = {
      params: {
        uid: 'test2@localhost',
      },
    };
    const result = await getOneUser(req, resp, next);
    delete result._doc._id;
    delete result._doc.__v;
    expect(result._doc).toEqual(userData);
    done();
  });
  it('should not get user requested with email: unknown@localhost and return 404', async (done) => {
    const req = {
      params: {
        uid: 'unknown@localhost',
      },
    };
    const result = await getOneUser(req, resp, next);
    expect(result).toBe(404);
    done();
  });
  it('should edit the user email', async (done) => {
    const req = {
      body: {
        email: 'newtest@localhost',
        password: 'changeme',
      },
      params: { uid: 'test@localhost' },
      headers: {
        user: userAddedReq.body,
      },
    };
    const result = await updateUser(req, resp, next);
    expect(result.email).toBe('newtest@localhost');
    done();
  });
  it('should not edit the user and return 404', async (done) => {
    const result = await updateUser(failedReq, resp, next);
    expect(result).toBe(404);
    done();
  });
  it('should delete user requested with email: test2@localhost', async (done) => {
    const req = {
      params: { uid: 'test2@localhost' },
    };
    const result = await deleteUser(req, resp, next);
    const userExists = await User.findOne({ email: req.params.uid });
    delete result._doc._id;
    delete result._doc.__v;
    expect(result._doc).toEqual(userData);
    expect(userExists).toBeNull();
    done();
  });
  it('should not edit the user and return 404', async (done) => {
    const result = await deleteUser(failedReq, resp, next);
    expect(result).toBe(404);
    done();
  });
  afterAll(async (done) => {
    await mockMongoose.helper.reset();
    await mockMongoose.killMongo();
    done();
  });
});
