const express = require('express');
const path = require('path');
const cors = require('cors');
const api_route = require('./src/routes/main_route.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "./public"), {extensions: ['html']}));
app.use('/api', api_route);

app.listen(port, () => {
    console.log(`Server run on http://localhost:${port}`);
})