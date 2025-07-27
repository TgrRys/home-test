const { Database } = require('../src/infrastructure/database/connection');
const DatabaseSchema = require('../src/infrastructure/database/schema/DatabaseSchema');
const PostgresBannerRepository = require('../src/infrastructure/repositories/PostgresBannerRepository');
const PostgresServiceRepository = require('../src/infrastructure/repositories/PostgresServiceRepository');
const Banner = require('../src/domain/entities/Banner');
const Service = require('../src/domain/entities/Service');

/**
 * Initialize test database with seed data
 */
async function initializeTestDatabase() {
    try {
        console.log('Initializing test database...');

        await Database.connect();
        console.log('Database connection established.');

        await DatabaseSchema.createAllTables();
        console.log('Database tables created.');

        await Database.query('DELETE FROM banners');
        await Database.query('DELETE FROM services');
        await Database.query('DELETE FROM users');
        console.log('Existing test data cleared.');

        await seedBannerData();
        console.log('Banner data seeded.');

        await seedServiceData();
        console.log('Service data seeded.');

        console.log('Test database initialization completed successfully.');
    } catch (error) {
        console.error('Failed to initialize test database:', error);
        throw error;
    }
}

/**
 * Close database connection
 */
async function closeDatabaseConnection() {
    try {
        await Database.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Failed to close database connection:', error);
    }
}

async function seedBannerData() {
    const bannerRepository = new PostgresBannerRepository(Database);

    const bannerData = [
        { banner_name: 'Banner 1', banner_image: 'https://nutech-integrasi.app/dummy.jpg', description: 'Lerem Ipsum Dolor sit amet' },
        { banner_name: 'Banner 2', banner_image: 'https://nutech-integrasi.app/dummy.jpg', description: 'Lerem Ipsum Dolor sit amet' },
        { banner_name: 'Banner 3', banner_image: 'https://nutech-integrasi.app/dummy.jpg', description: 'Lerem Ipsum Dolor sit amet' },
        { banner_name: 'Banner 4', banner_image: 'https://nutech-integrasi.app/dummy.jpg', description: 'Lerem Ipsum Dolor sit amet' },
        { banner_name: 'Banner 5', banner_image: 'https://nutech-integrasi.app/dummy.jpg', description: 'Lerem Ipsum Dolor sit amet' },
        { banner_name: 'Banner 6', banner_image: 'https://nutech-integrasi.app/dummy.jpg', description: 'Lerem Ipsum Dolor sit amet' }
    ];

    for (const data of bannerData) {
        try {
            const banner = new Banner(null, data.banner_name, data.banner_image, data.description);
            await bannerRepository.create(banner);
        } catch (error) {
            if (error.code !== '23505') {
                throw error;
            }
        }
    }
}

async function seedServiceData() {
    const serviceRepository = new PostgresServiceRepository(Database);

    const serviceData = [
        { service_code: 'PAJAK', service_name: 'Pajak PBB', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 40000 },
        { service_code: 'PLN', service_name: 'Listrik', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 10000 },
        { service_code: 'PDAM', service_name: 'PDAM Berlangganan', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 40000 },
        { service_code: 'PULSA', service_name: 'Pulsa', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 40000 },
        { service_code: 'PGN', service_name: 'PGN Berlangganan', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 50000 },
        { service_code: 'MUSIK', service_name: 'Musik Berlangganan', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 50000 },
        { service_code: 'TV', service_name: 'TV Berlangganan', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 50000 },
        { service_code: 'PAKET_DATA', service_name: 'Paket data', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 50000 },
        { service_code: 'VOUCHER_GAME', service_name: 'Voucher Game', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 100000 },
        { service_code: 'VOUCHER_MAKANAN', service_name: 'Voucher Makanan', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 100000 },
        { service_code: 'QURBAN', service_name: 'Qurban', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 200000 },
        { service_code: 'ZAKAT', service_name: 'Zakat', service_icon: 'https://nutech-integrasi.app/dummy.jpg', service_tariff: 300000 }
    ];

    for (const data of serviceData) {
        try {
            const service = new Service(null, data.service_code, data.service_name, data.service_icon, data.service_tariff);
            await serviceRepository.create(service);
        } catch (error) {
            if (error.code !== '23505') {
                throw error;
            }
        }
    }
}

module.exports = {
    initializeTestDatabase,
    closeDatabaseConnection,
    seedBannerData,
    seedServiceData
};
