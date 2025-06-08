const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

let inventory = [
  { id: 1, name: "Dark Chocolate", qty: 50, price: 2.5 },
  { id: 2, name: "Milk Chocolate", qty: 40, price: 2.0 },
  { id: 3, name: "White Chocolate", qty: 30, price: 2.2 }
];
let nextId = 4;
let bills = [];

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Inventory endpoints
app.get('/api/inventory', (req, res) => res.json(inventory));

app.post('/api/inventory', (req, res) => {
  const { name, qty, price } = req.body;
  const item = { id: nextId++, name, qty: Number(qty), price: Number(price) };
  inventory.push(item);
  res.json(item);
});

app.put('/api/inventory/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, qty, price } = req.body;
  const item = inventory.find(i => i.id === id);
  if (item) {
    item.name = name;
    item.qty = Number(qty);
    item.price = Number(price);
    res.json(item);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/api/inventory/:id', (req, res) => {
  const id = Number(req.params.id);
  inventory = inventory.filter(item => item.id !== id);
  res.sendStatus(204);
});

// Billing endpoints
app.get('/api/bills', (req, res) => res.json(bills));

app.post('/api/bills', (req, res) => {
  const { items } = req.body;
  // Reduce inventory
  items.forEach(billItem => {
    const inv = inventory.find(i => i.id === billItem.id);
    if (inv) inv.qty -= billItem.qty;
  });
  const bill = { id: bills.length + 1, date: new Date(), items };
  bills.push(bill);
  res.json(bill);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));