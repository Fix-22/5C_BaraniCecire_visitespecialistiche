const express = require("express");
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const app = express();
const database = require("./database");
database.createTables();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))); //permette accesso a bootstrap all'applicazione lato client

app.post("/insert", async (req, res) => {
  const booking = req.body;
  try {
    await database.insert(booking);
    res.json({result: "ok"});
  } catch (e) {
    console.error(e)
    res.status(500).json({result: "ko"});
  }
})
app.get('/bookings', async (req, res) => {
    const list = await database.selectBookings();
    res.json(list);
});
app.delete('/delete/:id', async (req, res) => {
  await database.delete(req.params.id);
  res.json({result: "ok"});
})

app.get('/types', async (req, res) => {
  const list = await database.selectTypes();
  res.json(list);
});

const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
  console.log("- server running on port: " + port);
});