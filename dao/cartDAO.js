// cartDAO.js
// Database queries for cart, checkout and purchase orders

const db = require('../config/db');

async function getCartItemsByUser(userId) {
    const [rows] = await db.query(
        `SELECT c.id AS cartItemId,
                c.vid,
                c.quantity,
                i.brand,
                i.model,
                i.price,
                i.quantity AS stock
         FROM Cart c
         JOIN Item i ON i.vid = c.vid
         WHERE c.user_id = ?`,
        [userId]
    );
    return rows;
}

async function findCartItem(userId, vehicleId) {
    const [rows] = await db.query(
        'SELECT * FROM Cart WHERE user_id = ? AND vid = ?',
        [userId, vehicleId]
    );
    return rows[0];
}

// Update quantity if item already exists
async function addOrUpdateCartItem(userId, vehicleId, quantity) {
    const existing = await findCartItem(userId, vehicleId);

    if (existing) {
        await db.query(
            'UPDATE Cart SET quantity = quantity + ? WHERE id = ?',
            [quantity, existing.id]
        );
        return { id: existing.id, updated: true };
    }

    const [result] = await db.query(
        'INSERT INTO Cart (user_id, vid, quantity) VALUES (?, ?, ?)',
        [userId, vehicleId, quantity]
    );

    return { id: result.insertId, updated: false };
}

async function updateCartItemQuantity(userId, cartItemId, quantity) {
    const [result] = await db.query(
        'UPDATE Cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, cartItemId, userId]
    );

    return result.affectedRows > 0;
}

async function removeCartItem(userId, cartItemId) {
    const [result] = await db.query(
        'DELETE FROM Cart WHERE id = ? AND user_id = ?',
        [cartItemId, userId]
    );

    return result.affectedRows > 0;
}

async function clearCart(userId) {
    await db.query(
        'DELETE FROM Cart WHERE user_id = ?',
        [userId]
    );
}

async function getVehicleById(vehicleId) {
    const [rows] = await db.query(
        'SELECT * FROM Item WHERE vid = ? LIMIT 1',
        [vehicleId]
    );

    return rows[0];
}

// Save shipping address
async function createAddress(userId, street, city, province, zip) {
    const [result] = await db.query(
        `INSERT INTO Address
        (user_id, street, city, province, zip)
        VALUES (?, ?, ?, ?, ?)`,
        [userId, street, city, province, zip]
    );

    return result.insertId;
}

async function createOrder(userId, addressId, totalAmount) {

    const [userRows] = await db.query(
        'SELECT fname, lname FROM Users WHERE id = ?',
        [userId]
    );

    const user = userRows[0];

    if (!user) {
        throw new Error('User not found');
    }

    const [result] = await db.query(
        `INSERT INTO PO
        (user_id, fname, lname, status, address_id, total_price)
        VALUES (?, ?, ?, 'ORDERED', ?, ?)`,
        [
            userId,
            user.fname,
            user.lname,
            addressId,
            totalAmount
        ]
    );

    return result.insertId;
}

async function addOrderItem(orderId, vehicleId, quantity, price) {
    await db.query(
        `INSERT INTO POItem
        (id, vid, price, quantity)
        VALUES (?, ?, ?, ?)`,
        [
            orderId,
            vehicleId,
            price,
            quantity
        ]
    );
}

async function getOrderById(orderId, userId) {
    const [rows] = await db.query(
        'SELECT * FROM PO WHERE id = ? AND user_id = ?',
        [orderId, userId]
    );

    return rows[0];
}

async function getOrderItems(orderId) {
    const [rows] = await db.query(
        `SELECT p.*,
                i.brand,
                i.model
         FROM POItem p
         JOIN Item i
            ON p.vid = i.vid
         WHERE p.id = ?`,
        [orderId]
    );

    return rows;
}

async function updateOrderStatus(orderId, status) {
    await db.query(
        'UPDATE PO SET status = ? WHERE id = ?',
        [status, orderId]
    );
}

// Payment is represented by PO.status.
// This function stays as a placeholder so the controller can call it.
async function createPayment(orderId, amount, paymentMethod, status, transactionRef) {
    await updateOrderStatus(orderId, status);
    return orderId;
}

module.exports = {
    getCartItemsByUser,
    findCartItem,
    addOrUpdateCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    getVehicleById,
    createAddress,
    createOrder,
    addOrderItem,
    getOrderById,
    getOrderItems,
    updateOrderStatus,
    createPayment
};