import { app } from '../../app';
import request from 'supertest';

it('returns 200 with a list of all users', async () => {
  await request(app).get('/api/users/').expect(200);
});
