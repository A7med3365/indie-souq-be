import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: any;

declare global {
  var signin: () => Promise<string[]>;
  var signup: () => Promise<string[]>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test1234',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(201);

  const cookie = res.get('Set-Cookie');

  return cookie;
};

global.signup = async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test1@test.com',
      password: 'test1234',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(201);

  const id = res.body.id;

  return id;
};
