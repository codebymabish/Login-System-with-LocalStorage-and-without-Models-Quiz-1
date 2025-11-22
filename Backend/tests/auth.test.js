const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Authentication Tests', () => {
    it('should sign up a new user', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'Password123'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should log in an existing user', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'Password123'
            });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'Password123'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should not log in with incorrect password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'WrongPassword'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should not sign up with an existing email', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'Password123'
            });

        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'Password123'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Email already exists');
    });
});