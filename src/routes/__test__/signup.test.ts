import { app } from '../../app';
import request from 'supertest';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test1234',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'test1234',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 't',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(400);
});

it('returns a 400 with an invalid name', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 't',
      firstName: 'te12',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(400);
});

it('returns a 400 with an invalid name', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 't',
      firstName: 'test',
      lastName: 'te12',
      isFilmmaker: false,
    })
    .expect(400);
});

it('returns a 400 with an invalid flag', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 't',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: 123,
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test1234',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test1234',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
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

  expect(res.get('Set-Cookie')).toBeDefined();
});
