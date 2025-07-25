# Home Test API

A RESTful API backend built with Express.js and PostgreSQL following clean architecture principles. This API provides user authentication, profile management, and image upload functionality.

## Features

- User registration and authentication with JWT
- Profile management (view and update)
- Profile image upload with format validation
- Clean architecture implementation
- Database integration with PostgreSQL
- Comprehensive test suite

## Project Structure

```
├── config                  # Configuration files
│   └── database.js         # Database configuration
├── scripts                 # Utility scripts
│   ├── initDb.js           # Database initialization script
│   └── run-tests-sequential.js  # Sequential test runner
├── src                     # Source code
│   ├── domain              # Domain layer (business entities and interfaces)
│   │   ├── entities        # Business entities
│   │   └── repositories    # Repository interfaces
│   ├── application         # Application layer (use cases)
│   │   └── use_cases       # Application use cases
│   ├── infrastructure      # Infrastructure layer (implementations)
│   │   ├── database        # Database related code
│   │   │   ├── connection.js  # Database connection
│   │   │   └── models      # Database models
│   │   ├── middlewares     # Infrastructure middleware
│   │   │   └── fileUpload.js # File upload middleware
│   │   └── repositories    # Repository implementations
│   ├── interfaces          # Interface layer (controllers, routes)
│   │   └── http            # HTTP interface
│   │       ├── controllers # HTTP controllers
│   │       ├── middlewares # HTTP middlewares
│   │       └── routes      # HTTP routes
│   ├── App.js              # Express application setup
│   └── index.js            # Application entry point
├── tests                   # Test files
│   └── integration         # Integration tests
├── .env                    # Environment variables
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

5. Initialize the database:
   ```
   npm run db:init
   ```

6. Run the server:
   ```
   npm run dev
   ```

The server will start on http://localhost:3000.

## API Endpoints

### Authentication

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

### Other Endpoints

- `GET /api/health`: Health check endpoint to verify API is running

## Development

### Available Scripts

- `npm run dev`: Start the development server with hot reloading
- `npm start`: Start the production server
- `npm test`: Run all tests (may encounter database conflicts)
- `npm run test:sequential`: Run tests sequentially (recommended)
- `npm run db:init`: Initialize database with tables and seed data

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

# Initialize database
npm run db:init
```

### Testing

For the most reliable test results, use the sequential test runner:

```bash
npm run test:sequential
```

This ensures that tests run one at a time to avoid database conflicts.
