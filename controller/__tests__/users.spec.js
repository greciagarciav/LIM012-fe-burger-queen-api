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
// npx jest --testEnvironment=node --runInBand --detectOpenHandles -t getUsers
const resp = {
  json: (obj) => obj,
  status: function status(responseStatus) {
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
const next = (number) => number;
const userData = {
  email: 'test2@localhost',
  password: bcrypt.hashSync('', 10),
  roles: {
    admin: false,
  },
};
describe('getUsers', () => {
  // beforeAll(async () => {
  //   await connectToDB('mongodb://127.0.0.1/BurguerQueen');
  //   await new User(userData).save();
  // });
  // afterAll(async () => {
  //   await User.deleteMany();
  // });
  beforeAll(async () => {
    mockMongoose.prepareStorage().then(async () => {
      await connectToDB('mongodb://127.0.0.1/BurguerQueen');
      await new User(userData).save();
    });
  });
  afterAll(async (done) => {
    mockMongoose.helper.reset();
    mongoose.connection.close();
    done();
  });
  console.log(mockMongoose.helper.isMocked());
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
    expect(newResult).toEqual([userAddedReq.body, userData]);
    expect(resp.statusCode).toBe(200);
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
    expect(resp.statusCode).toBe(200);
    done();
  });
  it('should add a user to the colection', async (done) => {
    const result = await addUser(userAddedReq, resp, next);
    expect(result.email).toBe('test@localhost');
    expect(result.password).toBeUndefined();
    expect(result.roles.admin).toBeFalsy();
    expect(resp.statusCode).toBe(200);
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
    expect(resp.statusCode).toBe(200);
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
    expect(resp.statusCode).toBe(200);
    done();
  });
});
