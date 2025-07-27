const request = require('supertest');
const App = require('../../src/App');
const { Database } = require('../../src/infrastructure/database/connection');
const { initializeTestDatabase, closeDatabaseConnection } = require('../testDbSetup');

let app;
let testUser = {
    email: 'testuser@nutech-integrasi.com',
    first_name: 'Test',
    last_name: 'User',
    password: 'password123'
};

beforeAll(async () => {
    try {
  
        await initializeTestDatabase();

       
        const appInstance = new App();
        app = appInstance.app;

        console.log('Membership tests setup completed.');
    } catch (error) {
        console.error('Membership test setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
    
        await Database.query('DELETE FROM users WHERE email LIKE $1', ['%test%']);

       
        await closeDatabaseConnection();

        console.log('Membership tests cleanup completed.');
    } catch (error) {
        console.error('Membership test teardown failed:', error);
    }
});

describe('Module 1: Membership API', () => {
    describe('POST /api/registration', () => {
        it('should register a user successfully with valid data', async () => {
            const response = await request(app)
                .post('/api/registration')
                .send(testUser)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({
                status: 0,
                message: 'Registrasi berhasil silahkan login',
                data: null
            });
        });

        it('should return error 102 when email format is invalid', async () => {
            const invalidEmailUser = {
                ...testUser,
                email: 'invalid-email-format'
            };

            const response = await request(app)
                .post('/api/registration')
                .send(invalidEmailUser)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 102,
                message: 'Paramter email tidak sesuai format',
                data: null
            });
        });

        it('should return error 103 when password is less than 8 characters', async () => {
            const shortPasswordUser = {
                ...testUser,
                email: 'shortpass@test.com',
                password: 'short'
            };

            const response = await request(app)
                .post('/api/registration')
                .send(shortPasswordUser)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 103,
                message: 'Password minimal 8 karakter',
                data: null
            });
        });

        it('should return error when email is already registered', async () => {
            const response = await request(app)
                .post('/api/registration')
                .send(testUser)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 101,
                message: 'Email sudah terdaftar',
                data: null
            });
        });
    });

    describe('POST /api/login', () => {
        it('should login successfully with correct credentials', async () => {
            const loginData = {
                email: testUser.email,
                password: testUser.password
            };

            const response = await request(app)
                .post('/api/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 0);
            expect(response.body).toHaveProperty('message', 'Login Sukses');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('token');
            expect(typeof response.body.data.token).toBe('string');
            expect(response.body.data.token.length).toBeGreaterThan(0);
        });

        it('should return error 102 when email format is invalid', async () => {
            const invalidLogin = {
                email: 'invalid-email',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/login')
                .send(invalidLogin)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 102,
                message: 'Paramter email tidak sesuai format',
                data: null
            });
        });

        it('should return error 103 when credentials are wrong', async () => {
            const wrongLogin = {
                email: 'wrong@email.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/login')
                .send(wrongLogin)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toEqual({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        });

        it('should return error 103 when password is wrong', async () => {
            const wrongPasswordLogin = {
                email: testUser.email,
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/login')
                .send(wrongPasswordLogin)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toEqual({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        });
    });

    describe('Profile APIs (Protected)', () => {
        let authToken;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post('/api/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            authToken = loginResponse.body.data.token;
        });

        describe('GET /api/profile', () => {
            it('should get user profile with valid token', async () => {
                const response = await request(app)
                    .get('/api/profile')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200);

                expect(response.body).toHaveProperty('status', 0);
                expect(response.body).toHaveProperty('message', 'Sukses');
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('email', testUser.email);
                expect(response.body.data).toHaveProperty('first_name', testUser.first_name);
                expect(response.body.data).toHaveProperty('last_name', testUser.last_name);
                expect(response.body.data).toHaveProperty('profile_image');
                expect(response.body.data).not.toHaveProperty('password');
            });

            it('should return error 108 with invalid token', async () => {
                const response = await request(app)
                    .get('/api/profile')
                    .set('Authorization', 'Bearer invalid-token')
                    .expect('Content-Type', /json/)
                    .expect(401);

                expect(response.body).toEqual({
                    status: 108,
                    message: 'Token tidak valid atau kadaluwarsa',
                    data: null
                });
            });

            it('should return error 108 with no token', async () => {
                const response = await request(app)
                    .get('/api/profile')
                    .expect('Content-Type', /json/)
                    .expect(401);

                expect(response.body).toEqual({
                    status: 108,
                    message: 'Token tidak valid atau kadaluwarsa',
                    data: null
                });
            });
        });

        describe('PUT /api/profile/update', () => {
            it('should update profile successfully with valid data', async () => {
                const updateData = {
                    first_name: 'Updated First',
                    last_name: 'Updated Last'
                };

                const response = await request(app)
                    .put('/api/profile/update')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updateData)
                    .expect('Content-Type', /json/)
                    .expect(200);

                expect(response.body).toHaveProperty('status', 0);
                expect(response.body).toHaveProperty('message', 'Update Pofile berhasil');
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('email', testUser.email);
                expect(response.body.data).toHaveProperty('first_name', updateData.first_name);
                expect(response.body.data).toHaveProperty('last_name', updateData.last_name);
                expect(response.body.data).toHaveProperty('profile_image');
            });

            it('should return error 108 with invalid token', async () => {
                const updateData = {
                    first_name: 'Test',
                    last_name: 'User'
                };

                const response = await request(app)
                    .put('/api/profile/update')
                    .set('Authorization', 'Bearer invalid-token')
                    .send(updateData)
                    .expect('Content-Type', /json/)
                    .expect(401);

                expect(response.body).toEqual({
                    status: 108,
                    message: 'Token tidak valid atau kadaluwarsa',
                    data: null
                });
            });
        });

        describe('PUT /api/profile/image', () => {
            it('should update profile image successfully with valid PNG file', async () => {
                const pngBuffer = Buffer.from([
                    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
                    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
                    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
                    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
                    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
                    0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
                    0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
                    0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00,
                    0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
                ]);

                const response = await request(app)
                    .put('/api/profile/image')
                    .set('Authorization', `Bearer ${authToken}`)
                    .attach('file', pngBuffer, 'test.png')
                    .expect('Content-Type', /json/)
                    .expect(200);

                expect(response.body).toHaveProperty('status', 0);
                expect(response.body).toHaveProperty('message', 'Update Profile Image berhasil');
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('email', testUser.email);
                expect(response.body.data).toHaveProperty('profile_image');
                expect(response.body.data.profile_image).toContain('yoururlapi.com');
            });

            it('should return error 102 with invalid file format', async () => {
                const textBuffer = Buffer.from('This is not an image');

                const response = await request(app)
                    .put('/api/profile/image')
                    .set('Authorization', `Bearer ${authToken}`)
                    .attach('file', textBuffer, 'test.txt')
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({
                    status: 102,
                    message: 'Format Image tidak sesuai',
                    data: null
                });
            });

            it('should return error 108 with invalid token', async () => {
                const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);

                const response = await request(app)
                    .put('/api/profile/image')
                    .set('Authorization', 'Bearer invalid-token')
                    .attach('file', pngBuffer, 'test.png')
                    .expect('Content-Type', /json/)
                    .expect(401);

                expect(response.body).toEqual({
                    status: 108,
                    message: 'Token tidak valid atau kadaluwarsa',
                    data: null
                });
            });
        });
    });
});
