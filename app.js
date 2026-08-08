const express = require('express');
const path = require('path');
const cors = require('cors');
const api_route = require('./src/routes/index.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get(/\.html$/, (req, res) => {
    const clean_url = req.url.replace('.html', '');
    res.redirect(301, clean_url);
})

// Rute untuk menangani halaman detail project
app.get('/pages/projects/project_detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/projects/project_detail.html'));
});

app.use(express.static(path.join(__dirname, "./public"), {extensions: ['html']}));
app.use('/api', api_route);

app.listen(port, () => {
    console.log(`Server run on http://localhost:${port}`);
})