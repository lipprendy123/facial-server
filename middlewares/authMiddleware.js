const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        // Pastikan header Authorization ada dan dimulai dengan "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token tidak ditemukan atau format salah" });
        }

        const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer "
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
        
        // Cari user berdasarkan ID dari token
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        req.user = user; // Simpan user di req.user agar bisa digunakan di route berikutnya
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);

        // Tangani error JWT spesifik
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token sudah kadaluarsa" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Token tidak valid" });
        }

        return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
};

module.exports = authMiddleware;
