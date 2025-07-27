#!/usr/bin/env node

const { Pool } = require('pg');
const DatabaseSchema = require('../src/infrastructure/database/schema/DatabaseSchema');

async function setupDatabase() {
    const dbName = process.env.DATABASE_URL ? 
        new URL(process.env.DATABASE_URL).pathname.slice(1) : 
        process.env.DB_NAME;
    const environment = process.env.NODE_ENV || 'development';

    console.log(`Setting up database: ${dbName} for ${environment} environment...`);

    // If DATABASE_URL is provided (Railway), use it directly
    if (process.env.DATABASE_URL) {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });

        try {
            console.log('Using Railway database connection...');
            await setupTables(pool);
            await seedData(pool, environment);
            console.log('Database setup completed successfully!');
        } catch (error) {
            console.error('Database setup failed:', error);
            throw error;
        } finally {
            await pool.end();
        }
        return;
    }

    // Local development setup
    const adminPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres'
    });

    try {
        console.log(`Terminating existing connections to ${dbName}...`);
        await adminPool.query(`
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = $1 AND pid <> pg_backend_pid()
        `, [dbName]);

        console.log(`Dropping database ${dbName} if exists...`);
        await adminPool.query(`DROP DATABASE IF EXISTS "${dbName}"`);

        console.log(`Creating fresh database ${dbName}...`);
        await adminPool.query(`CREATE DATABASE "${dbName}"`);

        console.log(`Database ${dbName} created successfully!`);
    } catch (error) {
        console.error('Error managing database:', error.message);
        throw error;
    } finally {
        await adminPool.end();
    }

    process.env.DB_NAME = dbName;

    const { Database } = require('../src/infrastructure/database/connection');

    try {
        console.log(`Initializing schema for ${dbName}...`);

        await Database.connect();

        await DatabaseSchema.createAllTables();
        console.log('Database tables created successfully');

        await seedInitialData();
        console.log('Initial data seeded successfully');

        console.log(`Database ${dbName} setup completed successfully!`);
    } catch (error) {
        console.error('Error initializing database:', error.message);
        throw error;
    } finally {
        await Database.close();
    }
}

async function seedInitialData() {
    const bcrypt = require('bcrypt');
    const { v4: uuidv4 } = require('uuid');
    const { Database } = require('../src/infrastructure/database/connection');

    const hashedPassword = await bcrypt.hash('admin123456', 10);
    const userId = uuidv4();

    await Database.query(`
        INSERT INTO users (id, first_name, last_name, email, password, profile_image)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
    `, [
        userId,
        'Admin',
        'User',
        'admin@example.com',
        hashedPassword,
        'https://yoururlapi.com/profile.jpeg'
    ]);

    const banners = [
        {
            banner_name: 'Banner 1',
            banner_image: 'https://nutech-integrasi.app/dummy.jpg',
            description: 'Lerem Ipsum Dolor sit amet'
        },
        {
            banner_name: 'Banner 2',
            banner_image: 'https://nutech-integrasi.app/dummy.jpg',
            description: 'Lerem Ipsum Dolor sit amet'
        },
        {
            banner_name: 'Banner 3',
            banner_image: 'https://nutech-integrasi.app/dummy.jpg',
            description: 'Lerem Ipsum Dolor sit amet'
        },
        {
            banner_name: 'Banner 4',
            banner_image: 'https://nutech-integrasi.app/dummy.jpg',
            description: 'Lerem Ipsum Dolor sit amet'
        },
        {
            banner_name: 'Banner 5',
            banner_image: 'https://nutech-integrasi.app/dummy.jpg',
            description: 'Lerem Ipsum Dolor sit amet'
        },
        {
            banner_name: 'Banner 6',
            banner_image: 'https://nutech-integrasi.app/dummy.jpg',
            description: 'Lerem Ipsum Dolor sit amet'
        }
    ];

    for (const banner of banners) {
        await Database.query(`
            INSERT INTO banners (id, banner_name, banner_image, description)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
        `, [uuidv4(), banner.banner_name, banner.banner_image, banner.description]);
    }

    const services = [
        {
            service_code: 'PAJAK',
            service_name: 'Pajak PBB',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 40000
        },
        {
            service_code: 'PLN',
            service_name: 'Listrik',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 10000
        },
        {
            service_code: 'PDAM',
            service_name: 'PDAM Berlangganan',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 40000
        },
        {
            service_code: 'PULSA',
            service_name: 'Pulsa',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 40000
        },
        {
            service_code: 'PGN',
            service_name: 'PGN Berlangganan',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 50000
        },
        {
            service_code: 'MUSIK',
            service_name: 'Musik Berlangganan',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 50000
        },
        {
            service_code: 'TV',
            service_name: 'TV Berlangganan',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 50000
        },
        {
            service_code: 'PAKET_DATA',
            service_name: 'Paket data',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 50000
        },
        {
            service_code: 'VOUCHER_GAME',
            service_name: 'Voucher Game',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 100000
        },
        {
            service_code: 'VOUCHER_MAKANAN',
            service_name: 'Voucher Makanan',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 100000
        },
        {
            service_code: 'QURBAN',
            service_name: 'Qurban',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 200000
        },
        {
            service_code: 'ZAKAT',
            service_name: 'Zakat',
            service_icon: 'https://nutech-integrasi.app/dummy.jpg',
            service_tariff: 300000
        }
    ];

    for (const service of services) {
        await Database.query(`
            INSERT INTO services (id, service_code, service_name, service_icon, service_tariff)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (service_code) DO NOTHING
        `, [uuidv4(), service.service_code, service.service_name, service.service_icon, service.service_tariff]);
    }
}

// function generateUUID() {
//     try {
//         const { v4: uuidv4 } = require('uuid');
//         return uuidv4();
//     } catch (error) {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//             const r = Math.random() * 16 | 0;
//             const v = c == 'x' ? r : (r & 0x3 | 0x8);
//             return v.toString(16);
//         });
//     }
// }

async function ensureDependencies() {
    try {
        require('bcrypt');
        require('uuid');
    } catch (error) {
        console.log('Installing required dependencies...');
        const { execSync } = require('child_process');
        execSync('npm install bcrypt uuid', { stdio: 'inherit' });
    }
}

async function main() {
    try {
        await ensureDependencies();
        await setupDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Database setup failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { setupDatabase };
