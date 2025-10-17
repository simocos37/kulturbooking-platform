import request from 'supertest';
import express from 'express';
import eventsRouter from '../routes/events';

const prismaMock = {
  event: {
    findMany: jest.fn().mockResolvedValue([
      { id: 'evt1', title: 'Test Event', description: 'desc', startAt: new Date().toISOString() }
    ])
  }
};

const app = express();
app.use(express.json());
app.use('/api/v1/events', eventsRouter(prismaMock as any));

describe('GET /api/v1/events', () => {
  it('should return events', async () => {
    const res = await request(app).get('/api/v1/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Test Event');
  });
});
