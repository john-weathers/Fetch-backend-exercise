const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuid } = require('uuid');
const { validReceipt, getPoints } = require('./helpers');
const PORT = process.env.PORT || 8080;
// object to store ids/receipts
let receipts = {};

// for the purposes of this app we'll enable all CORS requests
// if we were building an app that should only be accessed by specific origins we could specifiy cors options here
app.use(cors());
// parse incoming requests with JSON payloads
app.use(express.json());

app.post('/receipts/process', (req, res) => {
  const { retailer, purchaseDate, purchaseTime, items, total } = req.body;
  
  // check if receipt is valid
  if (!validReceipt(retailer, purchaseDate, purchaseTime, items, total)) return res.status(400).json({ "message": "The receipt is invalid" });

  // generate random id, persist to memory, send JSON response with receipt id
  const receiptId = uuid();
  receipts[receiptId] = req.body;
  res.status(200).json({ "id": receiptId });
});
app.get('/receipts/:id/points', (req, res) => {
  const receiptId = req.params.id;

  const receipt = receipts[receiptId];

  if (!receipt) return res.status(404).json({ "message": "No receipt found for that id" });

  const { retailer, purchaseDate, purchaseTime, items, total } = receipt;

  // pass properties to helper function, return points awarded, send JSON response with points awarded
  const points = getPoints(retailer, purchaseDate, purchaseTime, items, total);
  res.status(200).json({ "points": points });

});

app.all('*', (req, res, next) => {
  // catch all to handle non-matching requests
  res.sendStatus(404);
});
app.use((err, req, res, next) => {
  // very basic error handler
  console.error(err.stack)
  res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));