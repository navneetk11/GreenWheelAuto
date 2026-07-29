const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// UC01 — Register a new user
const register = async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;

        // Basic validation
        if (!fname || !lname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Checks if a user with this email already exists
        const [existing] = await db.query(
            'SELECT id FROM Users WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // Hash the password before storing it 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserts the new user (role defaults to 'customer' per the schema)
        const [result] = await db.query(
            'INSERT INTO Users (fname, lname, email, password) VALUES (?, ?, ?, ?)',
            [fname, lname, email, hashedPassword]
        );

        // Issues a JWT immediately so the user is signed in right after registering
        const token = jwt.sign(
            { id: result.insertId, email, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: result.insertId, fname, lname, email, role: 'customer' }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// UC02 — Sign in
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Look up the user by email
        const [rows] = await db.query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];

        // Compares the submitted password against the stored bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Issues a signed JWT containing the user's id, email, and role
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// UC02-- Sign out
const logout = async (req, res) => {
    
   
    res.status(200).json({ message: 'Logout successful. Please discard your token on the client.' });
};

module.exports = {
    register,
    login,
    logout
};
