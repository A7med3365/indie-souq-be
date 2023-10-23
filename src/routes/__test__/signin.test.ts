import { app } from '../../app';
import request from 'supertest';

it('fails when an email the does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test1234',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
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

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test123',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
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

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test1234',
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
