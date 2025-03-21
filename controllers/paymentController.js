const midtransClient = require("midtrans-client");
require("dotenv").config();

async function createTransaction(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const payment = req.body;
        console.log("Received payment data:", payment);
        
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        if (!serverKey) {
            throw new Error("MIDTRANS_SERVER_KEY is not defined in environment variables.");
        }

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: serverKey,
        });

        if (!payment.order_id || !payment.gross_amount || !payment.customer_details) {
            throw new Error("Invalid payment data. Required fields: order_id, gross_amount, customer_details");
        }

        const parameter = {
            transaction_details: {
                order_id: payment.order_id,
                gross_amount: payment.gross_amount
            },
            customer_details: {
                first_name: payment.customer_details.first_name,
                email: payment.customer_details.email,
                phone: payment.customer_details.phone
            },
            callbacks: {
                finish: `${process.env.FRONTEND_URL}/success`, // Redirect ke halaman success
                error: `${process.env.FRONTEND_URL}/booking-history`, // Redirect ke halaman yang sama untuk error
                pending: `${process.env.FRONTEND_URL}/booking-history` // Redirect ke halaman yang sama untuk pending
            }
        };

        const transaction = await snap.createTransaction(parameter);
        
        if (transaction.redirect_url) {
            return res.status(200).json({
                success: true,
                redirect_url: transaction.redirect_url
            });
        } else {
            throw new Error("Failed to generate payment URL");
        }

    } catch (error) {
        console.error("Error creating Midtrans payment:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create payment"
        });
    }
}

module.exports = { createTransaction };