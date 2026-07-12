-- ─────────────────────────────────────────
-- GreenWheel Auto — Database Schema
-- EECS 4413 Summer 2026
-- ─────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS greenwheeldb;
USE greenwheeldb;

-- ─────────────────────────────────────────
-- USERS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    fname       VARCHAR(50)  NOT NULL,
    lname       VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('customer', 'admin') DEFAULT 'customer',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- VEHICLES (ITEM) TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Item (
    vid                 VARCHAR(20)  NOT NULL PRIMARY KEY,
    name                VARCHAR(60)  NOT NULL,
    description         VARCHAR(255) NOT NULL,
    brand               VARCHAR(60)  NOT NULL,
    model               VARCHAR(60)  NOT NULL,
    year                INT          NOT NULL,
    shape               VARCHAR(30),
    condition_type      ENUM('New', 'Used') DEFAULT 'New',
    mileage             INT          DEFAULT 0,
    price               INT          NOT NULL,
    quantity            INT          NOT NULL DEFAULT 1,
    range_km            INT,
    range_winter_km     INT,
    exterior_color      VARCHAR(30),
    interior_color      VARCHAR(30),
    interior_fabric     VARCHAR(30),
    charging_speed      VARCHAR(20),
    drive_type          VARCHAR(10),
    has_history_report  BOOLEAN      DEFAULT FALSE,
    accident_reported   BOOLEAN      DEFAULT FALSE,
    is_hot_deal         BOOLEAN      DEFAULT FALSE,
    image_url           VARCHAR(255)
);

-- ─────────────────────────────────────────
-- ADDRESS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Address (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    street      VARCHAR(100) NOT NULL,
    city        VARCHAR(50)  NOT NULL,
    province    VARCHAR(50)  NOT NULL,
    country     VARCHAR(50)  NOT NULL DEFAULT 'Canada',
    zip         VARCHAR(20)  NOT NULL,
    phone       VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- ─────────────────────────────────────────
-- SHOPPING CART TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Cart (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT         NOT NULL,
    vid         VARCHAR(20) NOT NULL,
    quantity    INT         NOT NULL DEFAULT 1,
    added_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (vid)     REFERENCES Item(vid)
);

-- ─────────────────────────────────────────
-- PURCHASE ORDER TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PO (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT          NOT NULL,
    fname           VARCHAR(50)  NOT NULL,
    lname           VARCHAR(50)  NOT NULL,
    status          ENUM('PROCESSED', 'DENIED', 'ORDERED') NOT NULL,
    address_id      INT          NOT NULL,
    total_price     INT,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES Users(id),
    FOREIGN KEY (address_id) REFERENCES Address(id)
);

-- ─────────────────────────────────────────
-- PURCHASE ORDER ITEMS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS POItem (
    id      INT         NOT NULL,
    vid     VARCHAR(20) NOT NULL,
    price   INT         NOT NULL,
    PRIMARY KEY (id, vid),
    FOREIGN KEY (id)  REFERENCES PO(id),
    FOREIGN KEY (vid) REFERENCES Item(vid)
);

-- ─────────────────────────────────────────
-- REVIEWS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Reviews (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    vid         VARCHAR(20)  NOT NULL,
    rating      INT          CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (vid)     REFERENCES Item(vid)
);

-- ─────────────────────────────────────────
-- VISIT EVENTS TABLE (for admin analytics)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS VisitEvent (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    ipaddress   VARCHAR(20)  NOT NULL,
    day         VARCHAR(10)  NOT NULL,
    vid         VARCHAR(20)  NOT NULL,
    eventtype   VARCHAR(20)  NOT NULL,
    FOREIGN KEY (vid) REFERENCES Item(vid)
);

-- ─────────────────────────────────────────
-- SAMPLE DATA — VEHICLES
-- ─────────────────────────────────────────
INSERT INTO Item (vid, name, description, brand, model, year, shape, condition_type, mileage, price, quantity, range_km, range_winter_km, exterior_color, interior_color, interior_fabric, charging_speed, drive_type, has_history_report, accident_reported, is_hot_deal) VALUES
('v001', 'Tesla Model Y', 'Mid-size AWD SUV with long range', 'Tesla', 'Model Y', 2023, 'SUV', 'New', 0, 67999, 10, 533, 415, 'Midnight Silver', 'Black', 'Vegan Leather', 'Fast', 'AWD', FALSE, FALSE, TRUE),
('v002', 'Tesla Model 3', 'Compact sedan with autopilot', 'Tesla', 'Model 3', 2023, 'Sedan', 'New', 0, 54999, 8, 576, 448, 'Pearl White', 'Black', 'Vegan Leather', 'Fast', 'RWD', FALSE, FALSE, FALSE),
('v003', 'BMW iX', 'Luxury electric SUV', 'BMW', 'iX xDrive50', 2023, 'SUV', 'New', 0, 96000, 5, 630, 490, 'Alpine White', 'Mocha', 'Leather', 'Fast', 'AWD', FALSE, FALSE, FALSE),
('v004', 'Hyundai IONIQ 6', 'Streamlined long-range sedan', 'Hyundai', 'IONIQ 6', 2024, 'Sedan', 'New', 0, 54000, 8, 581, 450, 'Gravity Gold', 'Black', 'Cloth', 'Fast', 'RWD', FALSE, FALSE, TRUE),
('v005', 'Porsche Taycan', 'High performance luxury EV', 'Porsche', 'Taycan', 2023, 'Sedan', 'New', 0, 133000, 4, 484, 370, 'Frozen Blue', 'Cognac', 'Leather', 'Fast', 'AWD', FALSE, FALSE, FALSE),
('v006', 'Rivian R1T', 'Electric adventure truck', 'Rivian', 'R1T', 2022, 'Truck', 'Used', 18000, 72000, 3, 505, 390, 'Forest Green', 'Black', 'Vegan Leather', 'Fast', 'AWD', TRUE, FALSE, FALSE),
('v007', 'Ford Mustang Mach-E', 'Electric muscle SUV', 'Ford', 'Mustang Mach-E', 2023, 'SUV', 'New', 0, 58000, 6, 490, 375, 'Rapid Red', 'Black', 'Cloth', 'Fast', 'AWD', FALSE, FALSE, TRUE),
('v008', 'Chevrolet Equinox EV', 'Affordable family SUV', 'Chevrolet', 'Equinox EV', 2024, 'SUV', 'New', 0, 43000, 12, 483, 370, 'Summit White', 'Gray', 'Cloth', 'Standard', 'FWD', FALSE, FALSE, FALSE),
('v009', 'Audi Q8 e-tron', 'Premium electric SUV', 'Audi', 'Q8 e-tron', 2023, 'SUV', 'New', 0, 89000, 4, 582, 450, 'Glacier White', 'Brown', 'Leather', 'Fast', 'AWD', FALSE, FALSE, FALSE),
('v010', 'Nissan Ariya', 'Stylish crossover EV', 'Nissan', 'Ariya', 2023, 'SUV', 'New', 0, 47000, 7, 402, 310, 'Warm Silver', 'Black', 'Cloth', 'Standard', 'FWD', FALSE, FALSE, FALSE);

-- ─────────────────────────────────────────
-- SAMPLE DATA — ADMIN USER
-- ─────────────────────────────────────────
-- Password is 'admin123' (bcrypt hashed — update after first run)
INSERT INTO Users (fname, lname, email, password, role) VALUES
('Admin', 'GreenWheel', 'admin@greenwheelAuto.com', '$2b$10$examplehashedpassword', 'admin');

-- ─────────────────────────────────────────
-- SAMPLE DATA — VISIT EVENTS
-- ─────────────────────────────────────────
INSERT INTO VisitEvent (ipaddress, day, vid, eventtype) VALUES
('192.168.1.1', '2026-06-01', 'v001', 'VIEW'),
('192.168.1.1', '2026-06-01', 'v001', 'CART'),
('192.168.1.2', '2026-06-02', 'v003', 'VIEW'),
('192.168.1.3', '2026-06-03', 'v004', 'PURCHASE');