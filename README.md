# Home Test API

A complete RESTful API backend built with Express.js and PostgreSQL following clean architecture principles. This API provides comprehensive user management, transaction processing, and information services with full testing coverage and ready-to-use Postman collections.

## Features

- **Complete User Management** - Registration, authentication, and profile management with JWT
- **Transaction System** - Balance management, top-up functionality, and service transactions
- **Information Services** - Banner and service information endpoints
- **Profile Image Upload** - File upload with format validation and processing
- **Clean Architecture** - Domain-driven design with proper separation of concerns
- **PostgreSQL Integration** - Robust database layer with prepared statements
- **Comprehensive Testing** - 41 integration tests with 100% API coverage
- **Postman Collections** - Ready-to-use API testing environments
- **Production Ready** - Complete documentation and deployment configurations

## Project Structure

```
├── config                  # Configuration files
│   └── database.js         # Database configuration
├── postman                 # Postman collections and environments
│   ├── Home-Test-API.postman_collection.json           # Complete API collection
│   ├── Home-Test-Development.postman_environment.json  # Development environment
│   ├── Home-Test-Production.postman_environment.json   # Production environment
│   ├── README.md           # Postman documentation
│   └── QUICK-START.md      # Quick setup guide
├── scripts                 # Utility scripts
│   ├── initDb.js           # Database initialization script
│   ├── migrate.js          # Database migration script
│   ├── setupDb.js          # Complete database setup with seeding
│   └── run-tests-sequential.js  # Sequential test runner
├── src                     # Source code
│   ├── domain              # Domain layer (business entities and interfaces)
│   │   ├── entities        # Business entities (User, Transaction, Balance, etc.)
│   │   └── repositories    # Repository interfaces
│   ├── application         # Application layer (use cases)
│   │   └── use_cases       # Application use cases (12 complete use cases)
│   ├── infrastructure      # Infrastructure layer (implementations)
│   │   ├── database        # Database related code
│   │   │   ├── connection.js    # Database connection management
│   │   │   ├── operations       # Database operations
│   │   │   └── schema          # Database schema definitions
│   │   ├── middlewares     # Infrastructure middleware
│   │   │   └── fileUpload.js   # File upload middleware
│   │   └── repositories    # Repository implementations (PostgreSQL)
│   ├── interfaces          # Interface layer (controllers, routes)
│   │   └── http            # HTTP interface
│   │       ├── controllers # HTTP controllers (6 controllers)
│   │       ├── middlewares # HTTP middlewares (auth, error handling)
│   │       └── routes      # HTTP routes (6 route modules)
│   ├── App.js              # Express application setup
│   └── index.js            # Application entry point
├── tests                   # Test files
│   ├── integration         # Integration tests (3 comprehensive test suites)
│   ├── setup.js            # Test setup configuration
│   └── testDbSetup.js      # Test database utilities
├── .env                    # Environment variables
├── jest.config.js          # Jest test configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Clean Architecture

This project follows clean architecture principles which separate concerns into layers:

1. **Domain Layer**: 
   - Contains business entities (like `User`) and repository interfaces
   - Defines the core business rules and validation logic
   - Has no dependencies on other layers or frameworks

2. **Application Layer**: 
   - Contains use cases that implement business logic
   - Each use case represents a specific action (e.g., `CreateUser`, `LoginUser`)
   - Depends only on the domain layer
   - Format responses according to API specifications

3. **Infrastructure Layer**: 
   - Contains implementations of repository interfaces
   - Handles database access, file storage, and other external services
   - Example components include:
     - PostgreSQL database connection and models
     - File upload handling with multer

4. **Interface Layer**: 
   - Contains controllers, routes, and middleware for handling HTTP requests
   - Extracts data from requests and passes it to use cases
   - Formats responses from use cases to HTTP responses
   - Includes middleware for authentication and request validation

### Benefits of This Architecture

- **Separation of Concerns**: Each layer has a distinct responsibility
- **Testability**: Business logic can be tested independently of the delivery mechanism
- **Maintainability**: Changes to one layer have minimal impact on other layers
- **Flexibility**: External dependencies like databases can be replaced with minimal code changes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd home-test
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with the following configuration:
   ```
   # Server settings
   PORT=3000
   NODE_ENV=development
   
   # Database settings
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_NAME=home_test_db
   
   # JWT settings
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=12h
   ```

4. Create PostgreSQL databases:
   ```
   psql -U your_postgres_username postgres -c "CREATE DATABASE home_test_db;"
   psql -U your_postgres_username postgres -c "CREATE DATABASE home_test_db_test;"
   ```

5. Initialize the database with complete setup:
   ```
   npm run setup-db
   ```
   This will:
   - Create a fresh database
   - Set up all required tables
   - Seed initial data (admin user, banners, services)
   - Prepare the system for immediate use

6. Run the server:
   ```
   npm run dev
   ```

The server will start on http://localhost:3000.

## API Endpoints

The API provides complete functionality across three main modules:

### Module 1: Membership Management

#### Registration
- **Endpoint**: `POST /api/registration`
- **Description**: Creates a new user account
- **Access**: Public (no token required)
- **Request Body**:
  ```json
  {
    "email": "user@nutech-integrasi.com",
    "first_name": "User",
    "last_name": "Nutech",
    "password": "abcdef1234"
  }
  ```
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Registrasi berhasil silahkan login",
    "data": null
  }
  ```
- **Error Response** (400):
  ```json
  {
    "status": 102,
    "message": "Paramter email tidak sesuai format",
    "data": null
  }
  ```

#### Login
- **Endpoint**: `POST /api/login`
- **Description**: Authenticates user and returns JWT token
- **Access**: Public (no token required)
- **Request Body**:
  ```json
  {
    "email": "user@nutech-integrasi.com",
    "password": "abcdef1234"
  }
  ```
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Login Sukses",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Response** (401):
  ```json
  {
    "status": 103,
    "message": "Username atau password salah",
    "data": null
  }
  ```

### Profile Management

#### Get User Profile
- **Endpoint**: `GET /api/profile`
- **Description**: Retrieves current user's profile information
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Sukses",
    "data": {
      "email": "user@nutech-integrasi.com",
      "first_name": "User",
      "last_name": "Nutech",
      "profile_image": "https://yoururlapi.com/profile.jpeg"
    }
  }
  ```
- **Error Response** (401):
  ```json
  {
    "status": 108,
    "message": "Token tidak valid atau kadaluwarsa",
    "data": null
  }
  ```

#### Update User Profile
- **Endpoint**: `PUT /api/profile/update`
- **Description**: Updates user's profile information
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "first_name": "User Edited",
    "last_name": "Nutech Edited"
  }
  ```
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Update Pofile berhasil",
    "data": {
      "email": "user@nutech-integrasi.com",
      "first_name": "User Edited",
      "last_name": "Nutech Edited",
      "profile_image": "https://yoururlapi.com/profile.jpeg"
    }
  }
  ```

#### Update Profile Image
- **Endpoint**: `PUT /api/profile/image`
- **Description**: Updates user's profile image
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `multipart/form-data` with file field named "file"
- **Supported Formats**: JPEG, PNG only
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Update Profile Image berhasil",
    "data": {
      "email": "user@nutech-integrasi.com",
      "first_name": "User",
      "last_name": "Nutech",
      "profile_image": "https://yoururlapi.com/profile-updated.jpeg"
    }
  }
  ```
- **Error Response** (400):
  ```json
  {
    "status": 102,
    "message": "Format Image tidak sesuai",
    "data": null
  }
  ```

### Module 2: Information Services

#### Get Banners
- **Endpoint**: `GET /api/banner`
- **Description**: Retrieves all promotional banners
- **Access**: Public (no token required)
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Sukses",
    "data": [
      {
        "banner_name": "Banner 1",
        "banner_image": "https://nutech-integrasi.app/dummy.jpg",
        "description": "Lerem Ipsum Dolor sit amet"
      }
    ]
  }
  ```

#### Get Services
- **Endpoint**: `GET /api/services`
- **Description**: Retrieves all available services
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Sukses",
    "data": [
      {
        "service_code": "PAJAK",
        "service_name": "Pajak PBB",
        "service_icon": "https://nutech-integrasi.app/dummy.jpg",
        "service_tariff": 40000
      }
    ]
  }
  ```

### Module 3: Transaction Management

#### Get Balance
- **Endpoint**: `GET /api/balance`
- **Description**: Retrieves current user's balance
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Get Balance Berhasil",
    "data": {
      "balance": 1000000
    }
  }
  ```

#### Top Up Balance
- **Endpoint**: `POST /api/topup`
- **Description**: Adds money to user's balance
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "top_up_amount": 100000
  }
  ```
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Top Up Balance berhasil",
    "data": {
      "balance": 1100000
    }
  }
  ```

#### Create Transaction
- **Endpoint**: `POST /api/transaction`
- **Description**: Creates a service transaction
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "service_code": "PLN"
  }
  ```
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Transaksi berhasil",
    "data": {
      "invoice_number": "INV17082023-001",
      "service_code": "PLN",
      "service_name": "Listrik",
      "transaction_type": "PAYMENT",
      "total_amount": 10000,
      "created_on": "2023-08-17T10:10:10.000Z"
    }
  }
  ```

#### Get Transaction History
- **Endpoint**: `GET /api/transaction/history`
- **Description**: Retrieves user's transaction history
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `offset`: Starting point (optional, default: 0)
  - `limit`: Number of records (optional, default: all)
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Get History Berhasil",
    "data": {
      "offset": 0,
      "limit": 3,
      "records": [
        {
          "invoice_number": "INV17082023-001",
          "transaction_type": "TOPUP",
          "description": "Top Up balance",
          "total_amount": 100000,
          "created_on": "2023-08-17T10:10:10.000Z"
        }
      ]
    }
  }
  ```

### Utility Endpoints

#### Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies API is running and operational
- **Access**: Public (no token required)
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "API is running",
    "data": {
      "timestamp": "2023-08-17T10:10:10.000Z",
      "version": "1.0.0"
    }
  }
  ```

## Available Service Codes

For testing transactions, use these service codes:

| Service Code | Service Name | Price (IDR) |
|-------------|--------------|-------------|
| `PAJAK` | Pajak PBB | 40,000 |
| `PLN` | Listrik | 10,000 |
| `PDAM` | PDAM Berlangganan | 40,000 |
| `PULSA` | Pulsa | 40,000 |
| `PGN` | PGN Berlangganan | 50,000 |
| `MUSIK` | Musik Berlangganan | 50,000 |
| `TV` | TV Berlangganan | 50,000 |
| `PAKET_DATA` | Paket data | 50,000 |
| `VOUCHER_GAME` | Voucher Game | 100,000 |
| `VOUCHER_MAKANAN` | Voucher Makanan | 100,000 |
| `QURBAN` | Qurban | 200,000 |
| `ZAKAT` | Zakat | 300,000 |

## Postman Collections

Ready-to-use Postman collections are included in the `postman/` folder:

### Quick Start with Postman
1. Import `postman/Home-Test-API.postman_collection.json`
2. Import `postman/Home-Test-Development.postman_environment.json`
3. Select "Home Test - Development" environment
4. Use the pre-configured admin user:
   - **Email**: `admin@example.com`
   - **Password**: `admin123456`

### What's Included
- ✅ **Complete API Collection** - All 15+ endpoints with examples
- ✅ **Auto JWT Management** - Tokens automatically captured and used
- ✅ **Pre-configured Environments** - Development and production ready
- ✅ **Test Scripts** - Basic response validation included
- ✅ **Documentation** - Comprehensive usage guides

See `postman/README.md` for detailed instructions.

### Module 3: Transaction Management

#### Get Balance
- **Endpoint**: `GET /api/balance`
- **Description**: Retrieves current user's balance
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Get Balance Berhasil",
    "data": {
      "balance": 1000000
    }
  }
  ```

#### Top Up Balance
- **Endpoint**: `POST /api/topup`
- **Description**: Adds money to user's balance
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "top_up_amount": 100000
  }
  ```
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Top Up Balance berhasil",
    "data": {
      "balance": 1100000
    }
  }
  ```

#### Create Transaction
- **Endpoint**: `POST /api/transaction`
- **Description**: Creates a service transaction
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "service_code": "PLN"
  }
  ```
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Transaksi berhasil",
    "data": {
      "invoice_number": "INV17082023-001",
      "service_code": "PLN",
      "service_name": "Listrik",
      "transaction_type": "PAYMENT",
      "total_amount": 10000,
      "created_on": "2023-08-17T10:10:10.000Z"
    }
  }
  ```

#### Get Transaction History
- **Endpoint**: `GET /api/transaction/history`
- **Description**: Retrieves user's transaction history
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `offset`: Starting point (optional, default: 0)
  - `limit`: Number of records (optional, default: all)
- **Successful Response** (200):
  ```json
  {
    "status": 0,
    "message": "Get History Berhasil",
    "data": {
      "offset": 0,
      "limit": 3,
      "records": [
        {
          "invoice_number": "INV17082023-001",
          "transaction_type": "TOPUP",
          "description": "Top Up balance",
          "total_amount": 100000,
          "created_on": "2023-08-17T10:10:10.000Z"
        }
      ]
    }
  }
  ```

### Utility Endpoints

#### Health Check

## Development

### Available Scripts

- `npm run dev`: Start the development server with hot reloading
- `npm start`: Start the production server
- `npm test`: Run all tests (41 integration tests)
- `npm run test:sequential`: Run tests sequentially (recommended for reliability)
- `npm run setup-db`: Complete database setup with seeding (recommended)
- `npm run db:init`: Initialize database tables only
- `npm run migrate`: Run database migrations

### Database Setup

The application requires two PostgreSQL databases:
1. `home_test_db` - Main application database
2. `home_test_db_test` - Test database

To set up from scratch:

```bash
# Drop existing databases if needed
psql -U <username> postgres -c "DROP DATABASE IF EXISTS home_test_db_test;"
psql -U <username> postgres -c "DROP DATABASE IF EXISTS home_test_db;"

# Create fresh databases
psql -U <username> postgres -c "CREATE DATABASE home_test_db;"
psql -U <username> postgres -c "CREATE DATABASE home_test_db_test;"

# Initialize database with complete setup
npm run setup-db
```

### Testing

This project includes comprehensive integration tests with **100% API endpoint coverage** - all 41 tests validate every documented API endpoint according to the requirements.

#### Test Structure

- **Integration Tests**: Located in `tests/integration/`
  - `membership.test.js`: Tests for Module 1 (Registration, Login, Profile) - 16 test cases
  - `information.test.js`: Tests for Module 2 (Banner, Services) - 12 test cases  
  - `transaction.test.js`: Tests for Module 3 (Balance, Transactions, History) - 13 test cases
- **Test Utilities**: `tests/testDbSetup.js` - Database initialization and seeding for tests
- **Test Configuration**: `jest.config.js` - Jest configuration with test database setup

#### Running Tests

Run all tests:
```bash
npm test
```

Run tests with coverage report:
```bash
npm run test:coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

For the most reliable test results in development, use the sequential test runner:
```bash
npm run test:sequential
```

#### Test Coverage

**Current test coverage: 100% API endpoint coverage**
- **41 comprehensive test cases** covering all documented API endpoints
- **Complete workflow testing** - registration → login → transactions → history
- **All success and error scenarios** validated according to API specifications
- **Proper authentication and authorization** testing across all protected endpoints
- **Database operations and data validation** testing with real PostgreSQL integration
- **File upload testing** with multipart form data validation

#### Test Database

Tests use a separate test database configured in `tests/testDbSetup.js`:
- Automatic database initialization before each test suite
- Consistent seed data creation for banners and services
- Clean database state ensures test isolation
- Proper connection cleanup after all tests complete

#### What's Tested

**Module 1: Membership (16 tests)**
- ✅ User registration with comprehensive validation (email format, password strength)
- ✅ User login and JWT token generation with proper error handling
- ✅ Profile retrieval and updates with authentication validation
- ✅ Profile image upload functionality with file format validation
- ✅ Complete error handling for invalid inputs and edge cases

**Module 2: Information (12 tests)**
- ✅ Public banner access without authentication
- ✅ Protected services access with JWT authentication
- ✅ Authorization token validation and error responses
- ✅ Data structure validation and response format compliance

**Module 3: Transaction (13 tests)**
- ✅ Balance retrieval and management
- ✅ Top-up functionality with amount validation
- ✅ Service transaction creation with balance checking
- ✅ Transaction history with pagination support
- ✅ Complete transaction workflow testing
- ✅ Service code validation and error handling

#### Test Quality Assurance

All tests follow these principles:
- **Real Database Integration** - Tests run against actual PostgreSQL, not mocks
- **Complete API Compliance** - Every response validated against documented format
- **Authentication Flow** - Full JWT lifecycle testing
- **Error Scenario Coverage** - Invalid inputs, unauthorized access, insufficient balance
- **Data Integrity** - Transaction atomicity and balance consistency validation
