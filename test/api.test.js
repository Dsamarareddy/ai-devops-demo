const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  
  describe('GET /', () => {
    test('should return welcome message', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Welcome');
      expect(response.body.status).toBe('running');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/hello', () => {
    test('should return default greeting', async () => {
      const response = await request(app).get('/api/hello');
      
      expect(response.status).toBe(200);
      expect(response.body.greeting).toBe('Hello, World!');
      expect(response.body.generatedBy).toBe('AI DevOps Platform');
    });

    test('should return personalized greeting', async () => {
      const response = await request(app).get('/api/hello?name=Client');
      
      expect(response.status).toBe(200);
      expect(response.body.greeting).toBe('Hello, Client!');
    });
  });

  describe('POST /api/echo', () => {
    test('should echo back the request body', async () => {
      const testData = { test: 'data', number: 123 };
      const response = await request(app)
        .post('/api/echo')
        .send(testData);
      
      expect(response.status).toBe(200);
      expect(response.body.echo).toEqual(testData);
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });

});
