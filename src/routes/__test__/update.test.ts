import { app } from '../../app';
import request from 'supertest';
import { Project } from '../../models/project';
import mongoose from 'mongoose';

const createProject = async (creatorId: string[]) => {
  const res = await request(app).post('/api/projects').send({
    title: 'test',
    creator: creatorId,
  });
  //   console.log(res.body);
  return res;
};

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/projects/${id}`)
    // .set('Cookie', global.signin())
    .send({
      title: 'test',
    })
    .expect(404);
});

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const creatorId = await global.signup();
  await request(app)
    .put(`/api/projects/${id}`)
    // .set('Cookie', global.signin())
    .send({
      title: 'test',
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const creatorId = await global.signup();
  const response = await createProject(creatorId);

  await request(app)
    .put(`/api/projects/${response.body.id}`)
    .send({
      title: 'aslkdfj',
    })
    .expect(401);
});

it('returns a 401 if the user is not authorized', async () => {
  const creatorId = await global.signup();
  const response = await createProject(creatorId);

  await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', await global.signin())
    .send({
      title: 'aslkdfj',
    })
    .expect(401);
});

it('returns a 400 if the user provides not valid title', async () => {
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
  const creatorId = res.body.id;
  const response = await createProject(creatorId);

  await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
    })
    .expect(400);
});

it('returns a 400 if the user tries to change the creatorw', async () => {
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
  const creatorId = res.body.id;
  const response = await createProject(creatorId);

  await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfsadf',
      creator: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(400);
});

it('returns a 200 if the user updates the project successfully', async () => {
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
  const creatorId = res.body.id;
  const response = await createProject(creatorId);

  const putRes = await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfsadf',
    })
    .expect(200);

  expect(putRes.body.title).toEqual('asdfsadf');
});

it('returns a 200 if the user updates the project successfully', async () => {
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
  const creatorId = res.body.id;
  const response = await createProject(creatorId);

  const putRes = await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      type: 'short',
      genre: ['drama', 'action'],
      details: {
        goal: 1000,
        raised: 80,
      },
    })
    .expect(200);

  expect(putRes.body.type).toEqual('short');
  expect(putRes.body.genre).toEqual(['drama', 'action']);
  expect(putRes.body.details.goal).toEqual(1000);
  expect(putRes.body.details.raised).toEqual(80);
});
