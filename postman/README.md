# Postman Collections for Home Test API

This folder contains Postman collections and environments for testing the Home Test API.

## Files Included

### 📁 Collections
- **`Home-Test-API.postman_collection.json`** - Complete API collection with all endpoints

### 🌍 Environments  
- **`Home-Test-Development.postman_environment.json`** - Development environment (localhost:3000)
- **`Home-Test-Production.postman_environment.json`** - Production environment template

## How to Import

### Import Collection
1. Open Postman
2. Click **Import** button
3. Select `Home-Test-API.postman_collection.json`
4. Click **Import**

### Import Environments
1. Click **Import** button
2. Select the environment files:
   - `Home-Test-Development.postman_environment.json`  
   - `Home-Test-Production.postman_environment.json`
3. Click **Import**

## Usage Instructions

### 1. Setup Environment
- Select **"Home Test - Development"** environment from the dropdown
- The base URL is pre-configured to `http://localhost:3000/api`

### 2. Authentication Flow
1. **Register User** (optional) - Create a new test user
2. **Login User** - Get JWT token (automatically stored in environment)
3. Use authenticated endpoints with the stored token

### 3. API Testing Workflow

#### Quick Start with Admin User
The development environment includes pre-configured admin credentials:
- Email: `admin@example.com` 
- Password: `admin123456`

**Recommended Testing Flow:**
1. Run **Login User** with admin credentials
2. Test **Get Profile** to verify authentication
3. Test **Get Balance**, **Get Services**, **Get Banners**
4. Test **Top Up Balance** with amount: `100000`
5. Test **Create Transaction** with service code: `PLN`
6. Test **Get Transaction History**

#### Testing with New User
1. Run **Register User** (creates new test user)
2. Run **Login User** (gets JWT token)
3. Follow the same workflow above

### 4. Available Endpoints

#### 🔐 Authentication
- `POST /registration` - Register new user
- `POST /login` - Login user and get JWT token

#### 👤 Profile Management  
- `GET /profile` - Get user profile
- `PUT /profile/update` - Update profile information
- `PUT /profile/image` - Upload profile image

#### ℹ️ Information
- `GET /banner` - Get all banners (no auth required)
- `GET /services` - Get all services (auth required)

#### 💰 Transactions
- `GET /balance` - Get user balance  
- `POST /topup` - Top up balance
- `POST /transaction` - Create service transaction
- `GET /transaction/history` - Get transaction history
- `GET /transaction/history?offset=0&limit=3` - Get paginated history

#### 🔍 Health Check
- `GET /health` - API health status

## Environment Variables

### Development Environment
| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:3000/api` | API base URL |
| `jwt_token` | (auto-set) | JWT token from login |
| `user_email` | `admin@example.com` | Default admin email |
| `user_password` | `admin123456` | Default admin password |
| `test_user_email` | `test@example.com` | Test user email |
| `test_user_password` | `password123` | Test user password |

### Production Environment  
Update the production environment with your actual production URL and credentials.

## Features

✅ **Automatic Token Management** - JWT tokens are automatically captured and used  
✅ **Pre-configured Test Data** - Ready-to-use admin credentials  
✅ **Multiple Environments** - Development and production configurations  
✅ **Complete API Coverage** - All endpoints included  
✅ **Test Scripts** - Basic response validation included  
✅ **File Upload Support** - Profile image upload configured

## Service Codes for Testing

When testing transactions, use these service codes:
- `PAJAK` - Pajak PBB (40,000)
- `PLN` - Listrik (10,000)  
- `PDAM` - PDAM Berlangganan (40,000)
- `PULSA` - Pulsa (40,000)
- `PGN` - PGN Berlangganan (50,000)
- `MUSIK` - Musik Berlangganan (50,000)
- `TV` - TV Berlangganan (50,000)
- `PAKET_DATA` - Paket data (50,000)
- `VOUCHER_GAME` - Voucher Game (100,000)
- `VOUCHER_MAKANAN` - Voucher Makanan (100,000)
- `QURBAN` - Qurban (200,000)
- `ZAKAT` - Zakat (300,000)

## Notes

- Make sure your development server is running on `http://localhost:3000`
- JWT tokens expire after 12 hours
- File uploads use multipart/form-data
- All monetary amounts are in Indonesian Rupiah (IDR)
- Admin user is created automatically when running `setupDb.js`

## Troubleshooting

**Token Issues:**
- Re-run the Login request to get a fresh token
- Check that the environment is selected correctly

**Connection Issues:**  
- Verify the server is running
- Check the base_url in environment settings

**Authentication Errors:**
- Ensure JWT token is properly set in environment
- Check token expiration (12 hours)
