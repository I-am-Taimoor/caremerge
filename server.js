const express = require('express');
const axios = require('axios');

const app = express();

app.get('/I/want/title/', async (req, res) => {
  const addresses = req.query.address;

  if (!addresses) {
    return res.status(404).send('No addresses provided.');
  }

  const addressList = Array.isArray(addresses) ? addresses : [addresses];
  const results = await Promise.all(
    addressList.map(async (address) => {
      try {
        const response = await axios.get(`http://${address}`);
        const titleMatch = response.data.match(/<title>([^<]*)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'NO RESPONSE';
        return `<li>${address} - "${title}"</li>`;
      } catch (error) {
        return `<li>${address} - NO RESPONSE</li>`;
      }
    })
  );

  const htmlResponse = `
    <html>
    <head></head>
    <body>
      <h1>Following are the titles of given websites:</h1>
      <ul>
        ${results.join('')}
      </ul>
    </body>
    </html>
  `;

  res.send(htmlResponse);
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

