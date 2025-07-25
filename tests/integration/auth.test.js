const request = require('supertest');
const App = require('../../src/App');
const { sequelize } = require('../../src/infrastructure/database/connection');

let app;

beforeAll(async () => {
    try {
        // Make sure the database connection is established
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Create tables with force: true to ensure clean state
        await sequelize.sync({ force: true });
        console.log('Database tables created successfully.');

        // Create app instance
        const appInstance = new App();
        app = appInstance.app;
    } catch (error) {
        console.error('Setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        // Close database connection
        await sequelize.close();
        console.log('Database connection closed successfully.');
    } catch (error) {
        console.error('Teardown failed:', error);
    }
});

describe('POST /api/registration', () => {
    it('should register a user successfully', async () => {
        const userData = {
            email: 'user@nutech-integrasi.com',
            first_name: 'User',
            last_name: 'Nutech',
            password: 'abcdef1234'
        };

        const response = await request(app)
            .post('/api/registration')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: null
        });
    });

    it('should return error when email is invalid', async () => {
        const userData = {
            email: 'invalid-email',
            first_name: 'User',
            last_name: 'Nutech',
            password: 'abcdef1234'
        };

        const response = await request(app)
            .post('/api/registration')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            status: 102,
            message: 'Paramter email tidak sesuai format',
            data: null
        });
    });

    it('should return error when password is too short', async () => {
        const userData = {
            email: 'user2@nutech-integrasi.com',
            first_name: 'User',
            last_name: 'Nutech',
            password: 'short'
        };

        const response = await request(app)
            .post('/api/registration')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            status: 103,
            message: 'Password minimal 8 karakter',
            data: null
        });
    });

    it('should return error when email is already registered', async () => {
        // First registration
        const userData = {
            email: 'duplicate@nutech-integrasi.com',
            first_name: 'User',
            last_name: 'Nutech',
            password: 'abcdef1234'
        };

        await request(app)
            .post('/api/registration')
            .send(userData)
            .expect(200);

        // Second registration with same email
        const response = await request(app)
            .post('/api/registration')
            .send(userData)
            .expect(400);

        expect(response.body).toEqual({
            status: 101,
            message: 'Email sudah terdaftar',
            data: null
        });
    });
});

describe('POST /api/login', () => {
    // Register a user first to use for login tests
    beforeAll(async () => {
        const userData = {
            email: 'login-test@nutech-integrasi.com',
            first_name: 'Login',
            last_name: 'Test',
            password: 'password123'
        };

        await request(app)
            .post('/api/registration')
            .send(userData)
            .expect(200);
    });

    it('should login successfully with valid credentials', async () => {
        const credentials = {
            email: 'login-test@nutech-integrasi.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/login')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Login Sukses');
        expect(response.body.data).toHaveProperty('token');
        expect(typeof response.body.data.token).toBe('string');
    });

    it('should return error for invalid email format', async () => {
        const credentials = {
            email: 'invalid-email',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/login')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            status: 102,
            message: 'Paramter email tidak sesuai format',
            data: null
        });
    });

    it('should return error for short password', async () => {
        const credentials = {
            email: 'valid@nutech-integrasi.com',
            password: 'short'
        };

        const response = await request(app)
            .post('/api/login')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toEqual({
            status: 103,
            message: 'Password minimal 8 karakter',
            data: null
        });
    });

    it('should return error for wrong credentials', async () => {
        const credentials = {
            email: 'login-test@nutech-integrasi.com',
            password: 'wrongpassword123'
        };

        const response = await request(app)
            .post('/api/login')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(401);

        expect(response.body).toEqual({
            status: 103,
            message: 'Username atau password salah',
            data: null
        });
    });
});
