const request = require('supertest');
const jwt = require('jsonwebtoken');
const App = require('../../src/App');
const { sequelize } = require('../../src/infrastructure/database/connection');
const UserModel = require('../../src/infrastructure/database/models/UserModel');
const path = require('path');
const fs = require('fs');

let app;
let userToken;
const TEST_USER = {
    email: 'profile-test@nutech-integrasi.com',
    first_name: 'Profile',
    last_name: 'Test',
    password: 'password123'
};

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

        // Register a test user
        await request(app)
            .post('/api/registration')
            .send(TEST_USER);

        // Login to get a token
        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                email: TEST_USER.email,
                password: TEST_USER.password
            });

        userToken = loginResponse.body.data.token;
    } catch (error) {
        console.error('Setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        // Clean up test user if needed
        await UserModel.destroy({ where: { email: TEST_USER.email } });
        
        // Close the database connection
        await sequelize.close();
        console.log('Database connection closed successfully.');
    } catch (error) {
        console.error('Teardown failed:', error);
    }
});

describe('GET /api/profile', () => {
    it('should get user profile successfully with valid token', async () => {
        const response = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Sukses');
        expect(response.body.data).toHaveProperty('email', 'profile-test@nutech-integrasi.com');
        expect(response.body.data).toHaveProperty('first_name', 'Profile');
        expect(response.body.data).toHaveProperty('last_name', 'Test');
        expect(response.body.data).toHaveProperty('profile_image');
    });

    it('should return error for missing token', async () => {
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

    it('should return error for invalid token', async () => {
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

    it('should return error for expired token', async () => {
        // Create an expired token
        const JWT_SECRET = process.env.JWT_SECRET || 'nutech-integrasi-secret-key';
        const expiredToken = jwt.sign(
            { 
                data: 'profile-test@nutech-integrasi.com',
                exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
            }, 
            JWT_SECRET
        );

        const response = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${expiredToken}`)
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
    it('should update user profile successfully with valid token', async () => {
        const updateData = {
            first_name: 'User Edited',
            last_name: 'Nutech Edited'
        };

        const response = await request(app)
            .put('/api/profile/update')
            .set('Authorization', `Bearer ${userToken}`)
            .send(updateData)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Update Pofile berhasil');
        expect(response.body.data).toHaveProperty('email', 'profile-test@nutech-integrasi.com');
        expect(response.body.data).toHaveProperty('first_name', 'User Edited');
        expect(response.body.data).toHaveProperty('last_name', 'Nutech Edited');
        expect(response.body.data).toHaveProperty('profile_image');
    });

    it('should return error for missing token', async () => {
        const updateData = {
            first_name: 'User Edited',
            last_name: 'Nutech Edited'
        };

        const response = await request(app)
            .put('/api/profile/update')
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
    // Create a small test image
    const createTestImage = () => {
        const testImagePath = path.join(__dirname, 'test-image.jpg');
        
        // Check if the test image already exists
        if (!fs.existsSync(testImagePath)) {
            // Create a minimal JPEG file (just the header)
            const jpegHeader = Buffer.from([
                0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 
                0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 
                0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 
                0x00
            ]);
            fs.writeFileSync(testImagePath, jpegHeader);
        }
        
        return testImagePath;
    };

    // Clean up test image after tests
    afterAll(() => {
        const testImagePath = path.join(__dirname, 'test-image.jpg');
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
    });

    it('should update user profile image successfully with valid token and image', async () => {
        const testImagePath = createTestImage();

        const response = await request(app)
            .put('/api/profile/image')
            .set('Authorization', `Bearer ${userToken}`)
            .attach('file', testImagePath)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Update Profile Image berhasil');
        expect(response.body.data).toHaveProperty('email', 'profile-test@nutech-integrasi.com');
        expect(response.body.data).toHaveProperty('profile_image');
        expect(response.body.data.profile_image).not.toBe('https://yoururlapi.com/profile.jpeg');
    });

    it('should return error for missing token', async () => {
        const testImagePath = createTestImage();

        const response = await request(app)
            .put('/api/profile/image')
            .attach('file', testImagePath)
            .expect('Content-Type', /json/)
            .expect(401);

        expect(response.body).toEqual({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        });
    });

    it('should return error for invalid image format', async () => {
        // Create a text file that's not a valid image
        const invalidImagePath = path.join(__dirname, 'invalid-image.txt');
        fs.writeFileSync(invalidImagePath, 'This is not an image');

        try {
            const response = await request(app)
                .put('/api/profile/image')
                .set('Authorization', `Bearer ${userToken}`)
                .attach('file', invalidImagePath)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.status).toBe(102);
            expect(response.body.message).toBe('Format Image tidak sesuai');
            expect(response.body.data).toBe(null);
        } finally {
            // Clean up the invalid image file
            if (fs.existsSync(invalidImagePath)) {
                fs.unlinkSync(invalidImagePath);
            }
        }
    });
});
