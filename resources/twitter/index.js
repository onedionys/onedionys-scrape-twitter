const fetch = require('node-fetch');

function getTwitter(req, res) {
    res.json({
        status: 1,
        status_code: 200,
        message: "API ini digunakan untuk mengambil daftar komentar twitter berdasarkan kata kunci.",
        info_error: null,
        data: null
    })
}

module.exports = { getTwitter };