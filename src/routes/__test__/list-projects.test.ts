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

it('has a route handler listening to /api/projects for get requests', async () => {
  const response = await request(app).get('/api/projects').send({});

  expect(response.status).not.toEqual(404);
});

it('can fetch an empty list', async () => {
  const res = await request(app).get('/api/projects').expect(200);
  console.log(res.body);

  expect(res.body.length).toEqual(0);
});

it('can fetch a list of projects', async () => {
  const creatorId = await global.signup();
  await createProject(creatorId);
  await createProject(creatorId);
  await createProject(creatorId);

  const res = await request(app).get('/api/projects').expect(200);
  console.log(res.body);

  expect(res.body.length).toEqual(3);
});

it('returns a 404 if the project is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/projects/${id}`).send().expect(404);
});

it('returns a 400 if the project id is not valid', async () => {
  await request(app).get(`/api/projects/123`).send().expect(400);
});

it('returns the project if the project is found', async () => {
  const creatorId = await global.signup();
  const response = await createProject(creatorId);

  const projectResponse = await request(app)
    .get(`/api/projects/${response.body.id}`)
    .send()
    .expect(200);

  expect(projectResponse.body.title).toEqual('test');
  expect(projectResponse.body.creator.id).toEqual(creatorId);
});
