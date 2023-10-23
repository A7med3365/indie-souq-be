import { app } from '../../app';
import request from 'supertest';

it('returns 200 with a list of all users', async () => {
  await request(app).get('/api/users/').expect(200);
});

it('returns not found if user does not exists', async () => {
  await request(app).get('/api/users/111111111111111111111111').expect(404);
});

it('returns 200 with the user details', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test2@test.com',
      password: 'test1234',
      firstName: 'test',
      lastName: 'test',
      isFilmmaker: false,
    })
    .expect(201);

  const userId = res.body.id;

  await request(app).get(`/api/users/${userId}`).expect(200);
});
