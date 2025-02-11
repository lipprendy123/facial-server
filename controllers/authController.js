const bcrypt = require('bcrypt');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');

const authController = {
    // Register user baru
    async register(req, res) {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing details'
            });
        }

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash password sebelum menyimpan ke database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Buat user baru dengan field role (default adalah "user" jika tidak diberikan)
            const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
            await user.save();

            // Generate JWT token untuk authentication
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Simpan token di cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({ success: true, message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Login user
    async login(req, res) {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
        }
    
        try {
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(401).json({ success: false, message: 'Email tidak ditemukan' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Password salah' });
            }
    
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
    
            return res.json({
                success: true,
                token,
                message: 'Login berhasil',
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
        }
    },

    // Logout user
    async logout(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            });

            return res.json({ success: true, message: 'Logged Out!' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Mendapatkan user berdasarkan token
    async getUser(req, res) {
        try {
            const token = req.cookies.token;
            
            if (!token) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
    
            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Cari user berdasarkan ID dari token
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            return res.json({ success: true, user });
        } catch (error) {
            console.error("JWT Verification Error:", error);
    
            // Tangani error spesifik JWT
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Token expired" });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
    
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    
}

module.exports = { authController };
