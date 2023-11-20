const express = require("express");
const Loki = require("lokijs");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

const db = new Loki("loki.json"); // You can choose your database name

app.use(cors());
app.use(express.json());

app.get("/user", (req, res) => {

  const collection = db.getCollection("users") || db.addCollection("users");
  const data = collection ? collection.data : [];
  res.json(data);
});

app.post("/userUpdate", (req, res) => {
  // console.log("winning additions query2", req?.body);

  const users = db.getCollection("users") || db.addCollection("users");

  // Find the user document to update
  const user = users.findOne({ name: req?.body?.name });

  // // Update the user document
  user.playerBalance = req?.body?.balance;
  user.totalWinnings = req?.body?.totalWinnings
    ? req?.body?.totalWinnings
    : user.totalWinnings;

  // // Save the changes
  users.update(user);

  res.json(user);
});

app.post("/operatorUpdate", (req, res) => {
  // console.log("winning additions query2", req?.body);

  const users = db.getCollection("users") || db.addCollection("users");

  // Find the user document to update
  const user = users.findOne({ name: "operator" });



  // // Update the user document
  user.balance = req?.body?.balance;

  // // Save the changes
  users.update(user);

  res.json(user);
});

app.get("/getUser", (req, res) => {
  // console.log("getUser",req.query);
  // console.log("query1", req.query);

  const users = db.getCollection("users") || db.addCollection("users");

  var user = users.findOne({ name: req.query.name });

  res.json(user);
});

app.get("/getOperator", (req, res) => {
  // console.log("getUser",req.query);
  // console.log("query1", req.query);

  const users = db.getCollection("users") || db.addCollection("users");

  var user = users.findOne({ name: "operator" });

  res.json(user);
});

app.post("/addUser", (req, res) => {
  const data = req.body;

  // console.log("adding user", data);

  const collection = db.getCollection("users") || db.addCollection("users");
  const user = collection.insert(data);

  // console.log("new user", user);

  res.json(user);
});

app.post("/addTicket", (req, res) => {
  const data = req.body;

  // console.log("ticket data", req.body);

  const users = db.getCollection("users") || db.addCollection("users");

  var user = users.findOne({ name: req.body.playerName });

  if (user === null) {
  } else {
    // console.log("user found", user);
    user.tickets = [...user.tickets, req.body];

    const ticketAdded = users.update(user);

    res.json(ticketAdded);
  }
});

// Example route to insert data
app.post("/add/coupons", (req, res) => {
  // console.log("add/coupons/hitting");

  const opearatorUser = {
    coupons: req.body.coupons,
    number_of_coupons: req.body.number_of_coupons,
    balance: req.body.balance,
    name: "operator",
  }; // Assuming data is sent in the request body

  const users = db.getCollection("users") || db.addCollection("users");
  var user = users.findOne({ name: "operator" });

  if (user === null) {
    const operator = users.insert(opearatorUser);
    res.json(operator);
  } else {
    // console.log("operator already existas", user);
    user.balance = req.body.balance;
    user.number_of_coupons = req.body.number_of_coupons;
    user.coupons = req.body.coupons;

    const operatorUserUpdated = users.update(user);

    res.json(operatorUserUpdated);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
