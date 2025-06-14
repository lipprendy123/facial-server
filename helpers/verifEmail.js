const nodemailer = require('nodemailer')

const sendVerifEmail = async (email, name, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const verifyLink = `http://localhost:4000/api/auth/verify/${token}`

    const mailOptions = {
        from: `"Facial Treatment App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifikasi Akun',
        html: `
            <h3>Hai ${name}</h3>
            <p>Klik link dibawah untuk verifikasi akun kamu:</p>
            <a href="${verifyLink}">${verifyLink}</a>
            <p>Jika kamu tidak merasa mendaftar, abaikan email ini</p>
        `
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendVerifEmail