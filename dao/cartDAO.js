// cartDAO.js
// Database queries for cart, orders and payments

const db = require('../config/db');

async function getCartItemsByUser(userId) {
    const [rows] = await db.query(
        `SELECT c.id AS cartItemId, c.vehicle_id, c.quantity,
                v.make, v.model, v.price, v.stock
         FROM cart_items c
         JOIN vehicles v ON v.id = c.vehicle_id
         WHERE c.user_id = ?`,
        [userId]
    );
    return rows;
}

async function findCartItem(userId, vehicleId) {
    const [rows] = await db.query(
        'SELECT * FROM cart_items WHERE user_id = ? AND vehicle_id = ?',
        [userId, vehicleId]
    );
    return rows[0];
}

// Update quantity if item already exists
async function addOrUpdateCartItem(userId, vehicleId, quantity) {
    const existing = await findCartItem(userId, vehicleId);

    if (existing) {
        await db.query(
            'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
            [quantity, existing.id]
        );
        return { id: existing.id, updated: true };
    }

    const [result] = await db.query(
        'INSERT INTO cart_items (user_id, vehicle_id, quantity) VALUES (?, ?, ?)',
        [userId, vehicleId, quantity]
    );
    return { id: result.insertId, updated: false };
}

async function updateCartItemQuantity(userId, cartItemId, quantity) {
    const [result] = await db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, cartItemId, userId]
    );
    return result.affectedRows > 0;
}

async function removeCartItem(userId, cartItemId) {
    const [result] = await db.query(
        'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
        [cartItemId, userId]
    );
    return result.affectedRows > 0;
}

async function clearCart(userId) {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
}

async function getVehicleById(vehicleId) {
    const [rows] = await db.query(
        'SELECT * FROM vehicles WHERE id = ?', 
        [vehicleId]
    );
    return rows[0];
}

async function createOrder(userId, totalAmount) {
    const [result] = await db.query(
        `INSERT INTO orders (user_id, total_amount, status, payment_status)
         VALUES (?, ?, 'pending', 'unpaid')`,
        [userId, totalAmount]
    );
    return result.insertId;
}

async function addOrderItem(orderId, vehicleId, quantity, price) {
    await db.query(
        `INSERT INTO order_items (order_id, vehicle_id, quantity, price_at_purchase)
         VALUES (?, ?, ?, ?)`,
        [orderId, vehicleId, quantity, price]
    );
}

async function getOrderById(orderId, userId) {
    const [rows] = await db.query(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [orderId, userId]
    );
    return rows[0];
}

async function getOrderItems(orderId) {
    const [rows] = await db.query(
        `SELECT oi.*, v.make, v.model
         FROM order_items oi
         JOIN vehicles v ON v.id = oi.vehicle_id
         WHERE oi.order_id = ?`,
        [orderId]
    );
    return rows;
}

async function updateOrderStatus(orderId, status, paymentStatus) {
    await db.query(
        'UPDATE orders SET status = ?, payment_status = ? WHERE id = ?',
        [status, paymentStatus, orderId]
    );
}

async function createPayment(orderId, amount, paymentMethod, status, transactionRef) {
    const [result] = await db.query(
        `INSERT INTO payments (order_id, amount, payment_method, status, transaction_ref)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, amount, paymentMethod, status, transactionRef]
    );
    return result.insertId;
}

module.exports = {
    getCartItemsByUser,
    findCartItem,
    addOrUpdateCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    getVehicleById,
    createOrder,
    addOrderItem,
    getOrderById,
    getOrderItems,
    updateOrderStatus,
    createPayment
};