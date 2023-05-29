import request from 'supertest';
import app from '../app';

describe('Invalid ID Test', () => {
  test('Sending invalid ID should not crash the API', async () => {
    const response = await request(app)
      .post('/animal')
      .send({ id: 'test' });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});
