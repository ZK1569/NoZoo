const request = require('supertest');
const { app } = require('../index');

describe('AnimalController', () => {
  it('should return an error when adding more animals than allowed', async () => {
    const animal = {
      name: 'Lion',
      sex: 'male',
      date: '2023-05-25',
    };

    const response = await request(app)
      .post('/animal')
      .send(animal);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Max group size exceeded',
    });
  });
});
