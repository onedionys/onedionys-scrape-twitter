const fetch = require('node-fetch');

async function getHome(cookie = '', sid = '', page = 1) {
    const url = `https://sepolia.basescan.org/token/generic-tokentxns2?m=normal&contractAddress=0x87c51cd469a0e1e2af0e0e597fd88d9ae4baa967&a=&sid=${sid}&p=${page}`;

    const options = {
        method: "GET",
        body: null,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": cookie
        },
        referrerPolicy: "strict-origin-when-cross-origin"
    }

    try {
        const response = await fetch(url, options);
        const html = await response.text();

        return {
            status: true,
            data: html,
            error: null
        }
    } catch(error) {
        return {
            status: false,
            data: null,
            error: error
        }
    }
}

async function getSepolia(req, res) {
    try {
        let cookie = req.body.cookie;
        let sid = req.body.sid;
        let page = req.body.page;
        let fetchUser = await getHome(cookie, sid, page);

        if(fetchUser.status === true) {
            res.status(200).send(fetchUser.data);
        }else {
            res.status(422).json({
                error: 'cannot get data'
            });
        }
    } catch (error) {
        res.status(422).json({
            error: 'cannot get data'
        });
    }
}

module.exports = { getSepolia };