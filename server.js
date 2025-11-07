const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const cors = require('cors');

const app = express();

 app.use(cors());

 const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
app.use('/', middlewares, router);

 app.use(express.static(path.join(__dirname, 'build')));

 app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'), err => {
    if (err) res.status(500).send(err);
  });
});

 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
