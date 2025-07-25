# Home Test

A backend project using Express.js with PostgreSQL database following clean architecture principles.

## Project Structure

```
├── config                  # Configuration files
│   └── database.js         # Database configuration
├── src                     # Source code
│   ├── domain              # Domain layer (business entities and interfaces)
│   │   ├── entities        # Business entities
│   │   └── repositories    # Repository interfaces
│   ├── application         # Application layer (use cases)
│   │   └── use_cases       # Application use cases
│   ├── infrastructure      # Infrastructure layer (implementations)
│   │   ├── database        # Database related code
│   │   │   └── models      # Database models
│   │   └── repositories    # Repository implementations
│   ├── interfaces          # Interface layer (controllers, routes)
│   │   └── http            # HTTP interface
│   │       ├── controllers # HTTP controllers
│   │       ├── middlewares # HTTP middlewares
│   │       └── routes      # HTTP routes
│   ├── App.js              # Express application setup
│   └── index.js            # Application entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Clean Architecture

This project follows clean architecture principles:

1. **Domain Layer**: Contains business entities and repository interfaces.
2. **Application Layer**: Contains use cases that implement business logic.
3. **Infrastructure Layer**: Contains implementations of repositories and other infrastructure concerns.
4. **Interface Layer**: Contains controllers, routes, and other interface concerns.

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
   Edit the `.env` file to match your PostgreSQL configuration.

4. Create a PostgreSQL database:
   ```
   createdb home_test_db
   ```

5. Run the server:
   ```
   npm run dev
   ```

The server will start on http://localhost:3000.

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/users`: Create a new user
- `GET /api/users/:id`: Get a user by ID

## Development

- `npm run dev`: Start the development server with hot reloading
- `npm start`: Start the production server
- `npm test`: Run tests
