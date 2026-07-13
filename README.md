markdown# GreenWheel Auto — Electric Vehicle Online Store
EECS 4413 Section A | Summer 2026 | Group Project  

## Team Members
- Navneet 
- Arshya 
- Garima 
- Anjani 

---

## Project Overview
GreenWheel Auto is a multi-tier e-commerce web application for buying electric vehicles online. Customers can browse, filter, sort, and purchase EVs from multiple brands. The system includes an original use case — the EV Range Suitability Checker — which recommends vehicles based on the customer's daily driving habits and Canadian winter conditions.

---

## Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MySQL (local)
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Frontend:** Plain HTML (no CSS — D2 requirement)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/navneetk11/GreenWheelAuto.git
cd GreenWheelAuto
npm install
```

### 2. Create .env File
Copy `.env.example` and rename to `.env`:

### 3. Set Up Database
- Install MySQL and open MySQL Workbench
- Connect using root/root123
- Go to File → Open SQL Script → select `database/schema.sql`
- Click ⚡ to run — this creates all tables and inserts sample data

### 4. Start the Server
```bash
node server.js
```
Server runs on: `http://localhost:5000`

---

## How to Use the Application

### Full User Flow
1. **Register** → `http://localhost:5000/register.html`
2. **Login** → `http://localhost:5000/login.html`
3. **Browse Catalogue** → `http://localhost:5000/catalogue.html`
4. **Filter/Sort** vehicles by brand, shape, year, price, mileage
5. **View Vehicle Details** → click "View Details" on any vehicle
6. **Add to Cart** → click "Add to Cart" on vehicle detail page
7. **View Cart** → `http://localhost:5000/cart.html`
8. **Checkout** → `http://localhost:5000/checkout.html`
9. **Range Checker** → `http://localhost:5000/range-checker.html`

### Test Account
Email:    testuser@test.com
Password: password123
Or register a new account.

---

## API Endpoints

### Auth Routes
POST /api/auth/register   — Register new account
POST /api/auth/login      — Login and get JWT token
POST /api/auth/logout     — Logout

### Vehicle Routes
GET /api/vehicles                    — Browse all vehicles
GET /api/vehicles/filter?brand=Tesla — Filter vehicles
GET /api/vehicles/filter?sortBy=price&sortOrder=asc — Sort vehicles
GET /api/vehicles/:id                — View vehicle details

### Cart & Checkout Routes
GET    /api/cart              — View cart (requires token)
POST   /api/cart              — Add to cart (requires token)
PUT    /api/cart/:itemId      — Update quantity (requires token)
DELETE /api/cart/:itemId      — Remove from cart (requires token)
POST   /api/cart/checkout     — Checkout (requires token)
POST   /api/cart/payment      — Process payment (requires token)
GET    /api/cart/orders/:id   — View order (requires token)

### Range Checker Routes
POST /api/range/check         — Check EV suitability
GET  /api/range/vehicles      — All vehicles with range data
GET  /api/range/statistics    — Range statistics
GET  /api/range/top           — Top range vehicles

---

## Payment System
The payment service mimics real payment processing:
- Request 1 → ✅ APPROVED
- Request 2 → ✅ APPROVED  
- Request 3 → ❌ DENIED
- Request 4 → ✅ APPROVED (cycle repeats)

---

## Running Postman Tests
Postman collections are in the `postman/` folder:

| File | Routes Tested |
|------|--------------|
| vehicles_tests.json | UC03, UC04, UC05, UC06 |
| auth_tests.json | UC01, UC02 |
| cart_tests.json | UC11, UC12, UC13 |
| range-check-tests.json | UC16 |

To run:
1. Open Postman
2. Click Import → select JSON file from postman/ folder
3. Make sure server is running on port 5000
4. Click Send on each request

---

## Original Use Case — EV Range Suitability Checker (UC16)
Enter your daily commute distance, driving type, and Canadian postal code. The system calculates the realistic winter range for each vehicle and classifies them as:
- ✅ SUITABLE — vehicle comfortably covers your commute
- ⚠️ BORDERLINE — vehicle might work but needs frequent charging
- ❌ NOT RECOMMENDED — vehicle cannot reliably cover your commute

Winter range reduction is applied based on driving type:
- City driving: 25% reduction
- Mixed driving: 30% reduction
- Highway driving: 40% reduction

Home charger bonus: +5% range if customer has home charger

---

## Project Structure
GreenWheelAuto/
├── server.js              — Express server entry point
├── config/db.js           — MySQL database connection
├── routes/                — API route definitions
│   ├── vehicleRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   └── rangeRoutes.js
├── controllers/           — Business logic
│   ├── vehicleController.js
│   ├── authController.js
│   ├── cartController.js
│   └── rangeController.js
├── dao/
│   └── cartDAO.js         — Database queries for cart
├── middleware/
│   └── authMiddleware.js  — JWT token verification
├── views/                 — HTML pages (no CSS)
│   ├── register.html
│   ├── login.html
│   ├── catalogue.html
│   ├── vehicle-detail.html
│   ├── cart.html
│   ├── checkout.html
│   └── range-checker.html
├── postman/               — Postman test collections
├── database/
│   └── schema.sql         — Database schema + sample data
└── .env.example           — Environment variables template

---

## GitHub Repository
https://github.com/navneetk11/GreenWheelAuto