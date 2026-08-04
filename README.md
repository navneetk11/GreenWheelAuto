# GreenWheel Auto

An EV marketplace web application built for EECS 4413 (Section A, Summer 2026) — browse, filter, and purchase electric vehicles, with a range suitability checker, chatbot assistant, loan calculator, and customer reviews.

**Live site:** https://dnsc59f58orhn.cloudfront.net
**GitHub repository:** https://github.com/navneetk11/GreenWheelAuto

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework), styled with Tailwind CSS via CDN
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
- **Deployment:** AWS Elastic Beanstalk (application), AWS RDS (database), Amazon CloudFront (HTTPS/CDN)

---

## Prerequisites

Before installing, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [MySQL](https://dev.mysql.com/downloads/) (v8.0 or later) — MySQL Workbench recommended for managing the database
- [Git](https://git-scm.com/)
- A code editor such as [VS Code](https://code.visualstudio.com/)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/navneetk11/GreenWheelAuto.git
cd GreenWheelAuto
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

1. Open MySQL Workbench (or your preferred MySQL client) and connect to your local MySQL server.
2. Run the schema file located at `database/schema.sql` to create the database and all required tables (`Users`, `Item`, `Cart`, `PO`, `POItem`, `Address`, `Reviews`, `VisitEvent`).
3. This will also seed the database with 10 sample vehicles and a sample admin user.

If you hit a "safe update mode" error while running any `UPDATE`/`DELETE` statements manually, disable it first:
```sql
SET SQL_SAFE_UPDATES = 0;
```

### 4. Configure environment variables

Create a `.env` file in the project root (copy from `.env.example` if provided) with the following variables:

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=greenwheeldb
JWT_SECRET=greenwheelautosecret123
PORT=5000
```

Replace `DB_PASS` with your own local MySQL password. `DB_NAME` must match the database name created by `schema.sql`.

### 5. Add vehicle images

Vehicle images are not stored in the database — only their file paths are. Make sure the following folder exists and contains the vehicle photos (named `v001.jpg` through `v010.jpg`, matching the `vid` of each vehicle):

```
public/images/vehicles/
```

The site's logo should be placed at:
```
public/images/logo.png
```

### 6. Run the server

```bash
node server.js
```

You should see:
```
Server running on port 5000
```

### 7. Open the site

Go to:
```
http://localhost:5000/
```

This loads the vehicle catalogue directly — no login required to browse. You'll need to register/log in to add items to your cart, check out, or leave a review.

---

## Test Account

An admin account is seeded by the schema for testing:

```
Email: admin@greenwheelAuto.com
Password: admin123
```

You can also register a new account directly through the site's Register page.

---

## Features

- Browse, filter, and sort the vehicle catalogue
- Hot Deals section (lowest-priced vehicles)
- User registration, login, and logout (JWT-based)
- Shopping cart — add, update quantity, and remove items
- Checkout with shipping and payment form
- Vehicle reviews with 5-star ratings
- EV Range Suitability Checker (distinguished feature)
- Rule-based chatbot assistant (available on all pages)
- Loan calculator
- Cloud-native deployment on AWS with HTTPS

---

## Project Structure

```
GreenWheelAuto/
├── config/           # Database configuration
├── controllers/      # Route handler logic
├── dao/              # Data access layer (DAO pattern)
├── database/         # schema.sql and seed data
├── middleware/        # Auth middleware
├── public/
│   └── images/       # Vehicle photos, logo, background assets
├── routes/           # Express route definitions
├── views/            # Frontend HTML/CSS/JS pages
├── server.js         # Application entry point
├── package.json
└── .env              # Environment variables (not committed to Git)
```

---

## Deployment Notes

The production deployment uses:
- **AWS Elastic Beanstalk** to host the Node.js/Express backend
- **AWS RDS (MySQL)** for the production database, separate from the application server
- **Amazon CloudFront** in front of Elastic Beanstalk to provide HTTPS, since a single-instance Elastic Beanstalk environment has no load balancer and therefore no HTTPS listener on its own

If deploying your own copy, remember to set the same environment variables listed above in your Elastic Beanstalk environment's configuration (Configuration → Updates, monitoring, and logging → Environment properties), using your own RDS endpoint and credentials. Do not set `PORT` manually in Elastic Beanstalk — it is provided automatically by the platform.

---

## Team

- Navneet Kaur
- Arshya
- Garima
- Anjani
