const bcrypt = require('bcrypt');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');

const authController = {

    async register(req, res) {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            res.status(404).json({
                success: false,
                message: 'Missing details'
            })
        }

        try {
            const existingUser = await User.findOne({email})

            if (existingUser) {
                return res.json({
                    success: false,
                    message: 'User already exist'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = new User({name, email, password: hashedPassword})
            await user.save();

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({success: true});

        } catch (error) {
            res.json({
                success: false,
                message: error.message
            })
        }
    },


    async login(req, res) {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
        }
    
        try {
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(401).json({ success: false, message: "Email tidak ditemukan" });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Password salah" });
            }
    
            const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
    
            return res.json({
                success: true,
                token,
                message: "Login berhasil",
                user: { id: user._id, username: user.username, email: user.email }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
        }
    },
    

    async logout(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            });

            return res.json({
                success: true,
                message: 'Logged Out!'
            })

        } catch (error) {
            res.json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = {
    authController
}