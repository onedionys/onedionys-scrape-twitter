const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const helmet = require("helmet");
const index = require('./resources/twitter/index');
const comment = require('./resources/twitter/comment');
const home = require('./resources/sepolia/home');
const transaction = require('./resources/sepolia/transaction');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(cors());
app.use(helmet());

app.get('/', index.getTwitter);
app.post('/comment', comment.getTwitter);

app.post('/sepolia/home', home.getSepolia);
app.post('/sepolia/transaction', transaction.getSepolia);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app