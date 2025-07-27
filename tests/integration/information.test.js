const request = require('supertest');
const App = require('../../src/App');
const { Database } = require('../../src/infrastructure/database/connection');
const { initializeTestDatabase, closeDatabaseConnection } = require('../testDbSetup');

let app;
let authToken;

beforeAll(async () => {
    try {
        await initializeTestDatabase();

        const appInstance = new App();
        app = appInstance.app;

        const testUser = {
            email: 'infotest@nutech-integrasi.com',
            first_name: 'Info',
            last_name: 'Test',
            password: 'password123'
        };

        await request(app)
            .post('/api/registration')
            .send(testUser);

        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        authToken = loginResponse.body.data.token;
        console.log('Information tests setup completed.');
    } catch (error) {
        console.error('Information test setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        await Database.query('DELETE FROM users WHERE email LIKE $1', ['%infotest%']);

        await closeDatabaseConnection();

        console.log('Information tests cleanup completed.');
    } catch (error) {
        console.error('Information test teardown failed:', error);
    }
});

describe('Module 2: Information API', () => {
    describe('GET /api/banner', () => {
        it('should get all banners successfully (public access)', async () => {
            const response = await request(app)
                .get('/api/banner')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 0);
            expect(response.body).toHaveProperty('message', 'Sukses');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);

            const banner = response.body.data[0];
            expect(banner).toHaveProperty('banner_name');
            expect(banner).toHaveProperty('banner_image');
            expect(banner).toHaveProperty('description');
            expect(typeof banner.banner_name).toBe('string');
            expect(typeof banner.banner_image).toBe('string');
            expect(typeof banner.description).toBe('string');
        });

        it('should include expected banner data from documentation', async () => {
            const response = await request(app)
                .get('/api/banner')
                .expect(200);

            const banners = response.body.data;

            const expectedBanners = [
                'Banner 1', 'Banner 2', 'Banner 3',
                'Banner 4', 'Banner 5', 'Banner 6'
            ];

            expectedBanners.forEach(expectedName => {
                const foundBanner = banners.find(banner => banner.banner_name === expectedName);
                expect(foundBanner).toBeDefined();
                expect(foundBanner.banner_image).toBe('https://nutech-integrasi.app/dummy.jpg');
                expect(foundBanner.description).toBe('Lerem Ipsum Dolor sit amet');
            });
        });

        it('should work without authentication token (public API)', async () => {
            const response = await request(app)
                .get('/api/banner')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.status).toBe(0);
            expect(response.body.message).toBe('Sukses');
        });
    });

    describe('GET /api/services', () => {
        it('should get all services successfully with valid token', async () => {
            const response = await request(app)
                .get('/api/services')
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 0);
            expect(response.body).toHaveProperty('message', 'Sukses');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);

            const service = response.body.data[0];
            expect(service).toHaveProperty('service_code');
            expect(service).toHaveProperty('service_name');
            expect(service).toHaveProperty('service_icon');
            expect(service).toHaveProperty('service_tariff');
            expect(typeof service.service_code).toBe('string');
            expect(typeof service.service_name).toBe('string');
            expect(typeof service.service_icon).toBe('string');
            expect(typeof service.service_tariff).toBe('number');
        });

        it('should include expected service data from documentation', async () => {
            const response = await request(app)
                .get('/api/services')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            const services = response.body.data;

            const expectedServices = [
                { code: 'PAJAK', name: 'Pajak PBB', tariff: 40000 },
                { code: 'PLN', name: 'Listrik', tariff: 10000 },
                { code: 'PDAM', name: 'PDAM Berlangganan', tariff: 40000 },
                { code: 'PULSA', name: 'Pulsa', tariff: 40000 },
                { code: 'PGN', name: 'PGN Berlangganan', tariff: 50000 },
                { code: 'MUSIK', name: 'Musik Berlangganan', tariff: 50000 },
                { code: 'TV', name: 'TV Berlangganan', tariff: 50000 },
                { code: 'PAKET_DATA', name: 'Paket data', tariff: 50000 },
                { code: 'VOUCHER_GAME', name: 'Voucher Game', tariff: 100000 },
                { code: 'VOUCHER_MAKANAN', name: 'Voucher Makanan', tariff: 100000 },
                { code: 'QURBAN', name: 'Qurban', tariff: 200000 },
                { code: 'ZAKAT', name: 'Zakat', tariff: 300000 }
            ];

            expectedServices.forEach(expectedService => {
                const foundService = services.find(service => service.service_code === expectedService.code);
                expect(foundService).toBeDefined();
                expect(foundService.service_name).toBe(expectedService.name);
                expect(foundService.service_tariff).toBe(expectedService.tariff);
                expect(foundService.service_icon).toBe('https://nutech-integrasi.app/dummy.jpg');
            });

            expect(services.length).toBe(12);
        });

        it('should return error 108 with invalid token', async () => {
            const response = await request(app)
                .get('/api/services')
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
                .get('/api/services')
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toEqual({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        });

        it('should return error 108 with malformed authorization header', async () => {
            const response = await request(app)
                .get('/api/services')
                .set('Authorization', 'InvalidFormat token-here')
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
