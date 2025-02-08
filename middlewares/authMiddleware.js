const jwt = require('jsonwebtoken');
const User = require('../models/user_model'); // Pastikan model User di-import

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password"); // Ambil user tanpa password

        if (!user) {
            return res.status(401).json({ message: 'User tidak ditemukan' });
        }

        req.user = user; // Simpan user di req.user tanpa menimpa dengan decoded
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token tidak valid' });
    }
};

module.exports = authMiddleware;
