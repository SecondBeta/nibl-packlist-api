const express = require('express');
const app = express();
const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8080;

const searchPacks = require('./searchPacks');

app.get('/search', (request, response) => {
    const q = request.query.q;
    if (q != null) {
        searchPacks(q)
            .then(results => {
                response.status(200);
                response.json(results);
            });
    } else {
        response.end();
    }
});

app.get('/', (req, res) => res.send('Invalid route, use "/search?q="'));

app.listen(port, ip, () => console.log(`Nibl Packlist API listening on port ${port}!`));