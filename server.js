const express = require("express");
const Loki = require("lokijs");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

const db = new Loki("loki.json"); // You can choose your database name

app.use(cors());
app.use(express.json());

// Example route to retrieve data
app.get("/", (req, res) => {
  // console.log("home route hitting");
  const collection = db.getCollection("users") || db.addCollection("users");
  const data = collection ? collection.data : [];
  res.json(data);
});

app.get("/user", (req, res) => {
  // console.log("query2", req.params);
  // console.log("query1", req.query);
  const collection = db.getCollection("users") || db.addCollection("users");
  const data = collection ? collection.data : [];
  res.json(data);
});

app.post("/userUpdate", (req, res) => {
  console.log("winning additions query2", req?.body);
  // console.log("query1", req.query);
  // const collection = db.getCollection("users") || db.addCollection("users");
  // const data = collection ? collection.data : [];
  const users = db.getCollection("users") || db.addCollection("users");

  // Find the user document to update
  const user = users.findOne({ name: req?.body?.name });

  console.log("user", user);

  // // Update the user document
  user.playerBalance = req?.body?.balance;
  user.tw = req?.body?.Tw ? req?.body?.Tw : user.tw;

  // // Save the changes
  users.update(user);

  res.json(user);
});


app.post("/operatorUpdate", (req, res) => {
  console.log("winning additions query2", req?.body);
  // console.log("query1", req.query);
  // const collection = db.getCollection("users") || db.addCollection("users");
  // const data = collection ? collection.data : [];
  const users = db.getCollection("users") || db.addCollection("users");

  // Find the user document to update
  const user = users.findOne({ name: 'operator' });

  console.log("operator", user);

  // // Update the user document
  user.balance = req?.body?.balance;
  // user.tw = req?.body?.Tw ? req?.body?.Tw : user.tw;

  // // Save the changes
  users.update(user);

  res.json(user);
});

app.get("/getUser", (req, res) => {
  // console.log("getUser",req.query);
  // console.log("query1", req.query);

  const users = db.getCollection("users") || db.addCollection("users");

  // console.log('uuuuuuuuuuu',users)

  var user = users.findOne({ name: req.query.name });

  // const data = collection ? collection.data : [];

  // console.log('user data ',user)
  res.json(user);
});


app.get("/getOperator", (req, res) => {
  // console.log("getUser",req.query);
  // console.log("query1", req.query);

  const users = db.getCollection("users") || db.addCollection("users");

  // console.log('uuuuuuuuuuu',users)

  var user = users.findOne({ name: 'operator' });

  // const data = collection ? collection.data : [];

  // console.log('user data ',user)
  res.json(user);
});

app.post("/addUser", (req, res) => {
  const data = req.body; // Assuming data is sent in the request body

  console.log("adding user", data);

  const collection = db.getCollection("users") || db.addCollection("users");
  const user = collection.insert(data);


  console.log("new user", user);

  // db.saveDatabase();
  res.json(user);
});

app.post("/addTicket", (req, res) => {
  const data = req.body; // Assuming data is sent in the request body

  console.log("ticket data", req.body);

  const users = db.getCollection("users") || db.addCollection("users");

  var user = users.findOne({ name: req.body.playerName });

  if (user === null) {
    // const operator = users.insert(opearatorUser);
    // res.json(operator);
  } else {
    console.log("user found", user);
    user.tickets= [...user.tickets,req.body]

    const ticketAdded = users.update(user);

    res.json(ticketAdded);
  }
 

});




// Example route to insert data
app.post("/add/coupons", (req, res) => {
  console.log("add/coupons/hitting");

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
    console.log("operator already existas", user);
    user.balance = req.body.balance;
    user.number_of_coupons = req.body.number_of_coupons;
    user.coupons = req.body.coupons;

    const operatorUserUpdated = users.update(user);

    res.json(operatorUserUpdated);
  }
});

// Example route to retrieve data
app.get("/api/data", (req, res) => {
  // console.log("in home");
  const collection = db.getCollection("timeseries");
  const data = collection ? collection.data : [];
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
