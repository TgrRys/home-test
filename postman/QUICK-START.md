# Home Test API - Postman Quick Start

## 🚀 Quick Import & Test

### 1. Import Files
Drag and drop these files into Postman:
- `Home-Test-API.postman_collection.json`
- `Home-Test-Development.postman_environment.json`

### 2. Select Environment
Choose **"Home Test - Development"** from the environment dropdown

### 3. Test Authentication (30 seconds)
1. **Login User** → Get JWT token automatically
2. **Get Profile** → Verify authentication works
3. **Get Balance** → Check initial balance

### 4. Test Core Features (2 minutes)
1. **Get Services** → See available services
2. **Top Up Balance** → Add 100,000 to balance  
3. **Create Transaction** → Use service code "PLN"
4. **Get Transaction History** → View transaction

✅ **Done!** Your API is fully tested.

---

## 📋 Pre-configured Admin User
- **Email:** `admin@example.com`
- **Password:** `admin123456`

## 🎯 Service Codes for Testing
- `PLN` - Electricity (10,000 IDR)
- `PULSA` - Mobile Credit (40,000 IDR)  
- `VOUCHER_GAME` - Game Voucher (100,000 IDR)

## ⚙️ Requirements
- Server running on `http://localhost:3000`
- Database setup completed (`npm run setup-db`)

---
*See `README.md` for complete documentation*
