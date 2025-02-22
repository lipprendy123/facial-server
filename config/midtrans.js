const midtransClient = require('midtrans-client');

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
  isProduction: false, // false untuk sandbox, true untuk production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = snap;
