const midtransClient = require("midtrans-client");
require("dotenv").config(); // Load environment variables

async function createPayment(req, res) {
    try {
        const booking = req.body;
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        if (!serverKey) {
            throw new Error("MIDTRANS_SERVER_KEY is not defined in environment variables.");
        }

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: serverKey,
        });

        // Perbaiki validasi
        if (!booking || !booking.customer_details || !booking.customer_details.email || !booking.customer_details.first_name || !booking.customer_details.phone || !booking.gross_amount) {
            throw new Error("Invalid booking data. Missing required fields.");
        }

        const parameter = {
            transaction_details: {
                order_id: booking.order_id,
                gross_amount: booking.gross_amount,
            },
            customer_details: booking.customer_details,
        };

        const transaction = await snap.createTransaction(parameter);
        if (transaction.redirect_url) {
            return res.status(200).json({ redirect_url: transaction.redirect_url });
        } else {
            throw new Error("Midtrans transaction failed, redirect url not present");
        }

    } catch (error) {
        console.error("Error creating Midtrans payment:", error);
        res.status(500).json({ error: `Failed to create payment: ${error.message}` });
    }
}

module.exports = { createPayment }; // Export createPayment