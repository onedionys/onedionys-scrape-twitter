const fetch = require('node-fetch');

function getTwitter(req, res) {
    res.json({
        content: "This API is used to retrieve a list of twitter comments based on keywords."
    })
}

module.exports = { getTwitter };