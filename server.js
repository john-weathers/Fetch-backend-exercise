const express = require('express');
const app = express();
const { v4: uuid } = require('uuid');
const { validReceipt, getPoints } = require('./helpers');
const PORT = process.env.PORT || 8080;
let receipts = {};

app.use(express.json());

app.post('/receipts/process', (req, res) => {
  // destructure all receipt properties
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

});

app.all('*', (req, res, next) => {
  res.sendStatus(404);
});
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.message);
});

app.listen(() => console.log(`Server listening on port ${PORT}`));