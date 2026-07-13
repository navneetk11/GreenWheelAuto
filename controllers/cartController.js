// cartController.js
// Cart + Checkout + Payment routes (UC11, UC12, UC13)
// queries are in dao/cartDAO.js, this file just handles req/res stuff

const cartDAO = require('../dao/cartDAO');
let paymentCounter = 0;

// GET /api/cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await cartDAO.getCartItemsByUser(userId);

        const total = items.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0
        );

        res.json({ items, total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// POST /api/cart   body: { vehicleId, quantity }
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const {vehicleId, quantity} = req.body;

        if (!vehicleId || !quantity || quantity < 1) {
            return res.status(400).json({ error: 'vehicleId and a valid quantity are required' });
        }

        const vehicle = await cartDAO.getVehicleById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        if (vehicle.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        const result = await cartDAO.addOrUpdateCartItem(userId, vehicleId, quantity);
        res.status(201).json({ message: 'Item added to cart', cartItemId: result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// PUT /api/cart/:itemId   body: { quantity }
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'quantity must be at least 1' });
        }

        const updated = await cartDAO.updateCartItemQuantity(userId, itemId, quantity);
        if (!updated) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Cart item updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

// DELETE /api/cart/:itemId
exports.removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const removed = await cartDAO.removeCartItem(userId, itemId);
        if (!removed) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
};

// POST /api/cart/checkout
// Convert cart items into an order
exports.checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await cartDAO.getCartItemsByUser(userId);

        if (items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // verify stock availability before creating the order
        for (const item of items) {
            if (item.stock < item.quantity) {
                return res.status(400).json({ error: `Not enough stock for ${item.brand} ${item.model}` });
            }
        }

        let total = 0;
        for (const item of items) {
            total += Number(item.price) * item.quantity;
        }

        const {
            street,
            city,
            province,
            zip
        } = req.body;
        if (!street || !city || !province || !zip) {
    return res.status(400).json({
        error: 'Shipping address is required'
    });
}
        const addressId =
            await cartDAO.createAddress(
                userId,
                street,
                city,
                province,
                zip
            );
        const orderId =
            await cartDAO.createOrder(
                userId,
                addressId,
                total
            );

        for (const item of items) {
            await cartDAO.addOrderItem(
                orderId,
                item.vid,
                item.quantity,
                item.price
            );
        }

        await cartDAO.clearCart(userId);

        res.status(201).json({
            message: 'Checkout completed successfully',
            orderId,
            total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Checkout failed' });
    }
};

// POST /api/cart/payment   body: { orderId, paymentMethod }
// Mock payment processing
exports.processPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {orderId,paymentMethod}  = req.body;

        if (!orderId || !paymentMethod) {
            return res.status(400).json({ error: 'orderId and paymentMethod are required' });
        }

        const order = await cartDAO.getOrderById(orderId, userId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status === 'PROCESSED') {
            return res.status(400).json({ error: 'Order already paid' });
        }

        
        paymentCounter++;
const approved = (paymentCounter % 3 !== 0);

        if (approved) {
            await cartDAO.updateOrderStatus(orderId, 'PROCESSED');
            return res.json({
                message: 'Order Successfully Completed!',
                orderId
            });
        } else {
            await cartDAO.updateOrderStatus(orderId, 'DENIED');
            return res.status(400).json({
                message: 'Credit Card Authorization Failed.',
                orderId
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Payment failed' });
    }
};

// GET /api/cart/orders/:orderId
exports.getOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId} = req.params;

        const order = await cartDAO.getOrderById(orderId, userId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const items = await cartDAO.getOrderItems(orderId);
        res.json({ order, items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};