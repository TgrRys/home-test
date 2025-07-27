const request = require('supertest');
const App = require('../../src/App');
const { Database } = require('../../src/infrastructure/database/connection');
const { initializeTestDatabase, closeDatabaseConnection } = require('../testDbSetup');

let app;
let testUser = {
    email: 'transactionuser@nutech-integrasi.com',
    first_name: 'Transaction',
    last_name: 'User',
    password: 'password123'
};

beforeAll(async () => {
    try {
        await initializeTestDatabase();

        const appInstance = new App();
        app = appInstance.app;

        console.log('Transaction tests setup completed.');
    } catch (error) {
        console.error('Transaction test setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        await Database.query('DELETE FROM users WHERE email LIKE $1', ['%transactionuser%']);
        await Database.query('DELETE FROM balances WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1)', ['%transactionuser%']);
        await Database.query('DELETE FROM transactions WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1)', ['%transactionuser%']);

        await closeDatabaseConnection();

        console.log('Transaction tests cleanup completed.');
    } catch (error) {
        console.error('Transaction test teardown failed:', error);
    }
});

describe('Module 3: Transaction API', () => {
    let authToken;

    beforeAll(async () => {
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
    });

    describe('GET /api/balance', () => {
        it('should get initial balance of 0', async () => {
            const response = await request(app)
                .get('/api/balance')
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({
                status: 0,
                message: 'Get Balance Berhasil',
                data: {
                    balance: 0
                }
            });
        });

        it('should return error 108 with invalid token', async () => {
            const response = await request(app)
                .get('/api/balance')
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
                .get('/api/balance')
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toEqual({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        });
    });

    describe('POST /api/topup', () => {
        it('should top up balance successfully with valid amount', async () => {
            const topupData = {
                top_up_amount: 100000
            };

            const response = await request(app)
                .post('/api/topup')
                .set('Authorization', `Bearer ${authToken}`)
                .send(topupData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 0);
            expect(response.body).toHaveProperty('message', 'Top Up Balance berhasil');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('balance', 100000);
        });

        it('should return error 102 with invalid amount (negative)', async () => {
            const invalidTopupData = {
                top_up_amount: -10000
            };

            const response = await request(app)
                .post('/api/topup')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidTopupData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 102,
                message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
                data: null
            });
        });

        it('should return error 102 with invalid amount (not a number)', async () => {
            const invalidTopupData = {
                top_up_amount: 'invalid'
            };

            const response = await request(app)
                .post('/api/topup')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidTopupData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 102,
                message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
                data: null
            });
        });

        it('should return error 108 with invalid token', async () => {
            const topupData = {
                top_up_amount: 50000
            };

            const response = await request(app)
                .post('/api/topup')
                .set('Authorization', 'Bearer invalid-token')
                .send(topupData)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toEqual({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        });
    });

    describe('POST /api/transaction', () => {
        it('should process payment transaction successfully with valid service', async () => {
            const transactionData = {
                service_code: 'PLN'
            };

            const response = await request(app)
                .post('/api/transaction')
                .set('Authorization', `Bearer ${authToken}`)
                .send(transactionData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 0);
            expect(response.body).toHaveProperty('message', 'Transaksi berhasil');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('invoice_number');
            expect(response.body.data).toHaveProperty('service_code', 'PLN');
            expect(response.body.data).toHaveProperty('service_name', 'Listrik');
            expect(response.body.data).toHaveProperty('transaction_type', 'PAYMENT');
            expect(response.body.data).toHaveProperty('total_amount', '10000');
            expect(response.body.data).toHaveProperty('created_on');
            expect(response.body.data.invoice_number).toMatch(/^INV\d{8}-\d{3}$/);
        });

        it('should return error 102 with invalid service code', async () => {
            const invalidTransactionData = {
                service_code: 'INVALID_SERVICE'
            };

            const response = await request(app)
                .post('/api/transaction')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidTransactionData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 102,
                message: 'Service ataus Layanan tidak ditemukan',
                data: null
            });
        });

        it('should return error 102 with insufficient balance', async () => {
            const expensiveTransactionData = {
                service_code: 'VOUCHER_GAME' 
            };

            const response = await request(app)
                .post('/api/transaction')
                .set('Authorization', `Bearer ${authToken}`)
                .send(expensiveTransactionData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({
                status: 102,
                message: 'Balance tidak mencukupi',
                data: null
            });
        });

        it('should return error 108 with invalid token', async () => {
            const transactionData = {
                service_code: 'PLN'
            };

            const response = await request(app)
                .post('/api/transaction')
                .set('Authorization', 'Bearer invalid-token')
                .send(transactionData)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toEqual({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        });
    });

    describe('GET /api/transaction/history', () => {
        it('should get transaction history with default pagination', async () => {
            const response = await request(app)
                .get('/api/transaction/history')
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 0);
            expect(response.body).toHaveProperty('message', 'Get History Berhasil');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('offset', 0);
            expect(response.body.data).toHaveProperty('limit');
            expect(response.body.data).toHaveProperty('records');
            expect(Array.isArray(response.body.data.records)).toBe(true);
            expect(response.body.data.records.length).toBeGreaterThan(0);

            const transaction = response.body.data.records[0];
            expect(transaction).toHaveProperty('invoice_number');
            expect(transaction).toHaveProperty('transaction_type');
            expect(transaction).toHaveProperty('description');
            expect(transaction).toHaveProperty('total_amount');
            expect(transaction).toHaveProperty('created_on');
            expect(transaction.invoice_number).toMatch(/^INV\d{8}-\d{3}$/);
        });

        it('should get transaction history with custom pagination', async () => {
            const response = await request(app)
                .get('/api/transaction/history?offset=0&limit=1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 0);
            expect(response.body).toHaveProperty('message', 'Get History Berhasil');
            expect(response.body.data).toHaveProperty('offset', 0);
            expect(response.body.data).toHaveProperty('limit', 1);
            expect(response.body.data.records.length).toBeLessThanOrEqual(1);
        });

        it('should return error 108 with invalid token', async () => {
            const response = await request(app)
                .get('/api/transaction/history')
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
                .get('/api/transaction/history')
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toEqual({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        });
    });

    describe('Transaction Flow Integration', () => {
        it('should verify balance is updated correctly after topup and payment', async () => {
            const initialBalance = await request(app)
                .get('/api/balance')
                .set('Authorization', `Bearer ${authToken}`);

            const currentBalance = initialBalance.body.data.balance;

            await request(app)
                .post('/api/topup')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ top_up_amount: 50000 });

            const afterTopup = await request(app)
                .get('/api/balance')
                .set('Authorization', `Bearer ${authToken}`);

            expect(afterTopup.body.data.balance).toBe(currentBalance + 50000);

            await request(app)
                .post('/api/transaction')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ service_code: 'PDAM' });

            const finalBalance = await request(app)
                .get('/api/balance')
                .set('Authorization', `Bearer ${authToken}`);

            expect(finalBalance.body.data.balance).toBe(currentBalance + 50000 - 40000);
        });

        it('should have correct transaction types in history', async () => {
            const response = await request(app)
                .get('/api/transaction/history?limit=10')
                .set('Authorization', `Bearer ${authToken}`);

            const transactions = response.body.data.records;

            const topupTransactions = transactions.filter(t => t.transaction_type === 'TOPUP');
            const paymentTransactions = transactions.filter(t => t.transaction_type === 'PAYMENT');

            expect(topupTransactions.length).toBeGreaterThan(0);
            expect(paymentTransactions.length).toBeGreaterThan(0);

            transactions.forEach(transaction => {
                expect(typeof transaction.total_amount).toBe('string');
                expect(parseInt(transaction.total_amount)).toBeGreaterThan(0);
            });
        });
    });
});
