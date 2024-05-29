const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const { Usercollection, Propertycollection } = require("./mongodb");

const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login.hbs");
});

app.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

app.get("/seller", async (req, res) => {
  const sellerId = req.query.userid;
  try {
    const properties = await Propertycollection.find({ userid: sellerId });
    res.render("seller", { sellerId, properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.send("Error fetching properties");
  }
});

app.get("/buyer", async (req, res) => {
  try {
    // Fetch rental properties from the database
    const properties = await Propertycollection.find();

    // Render the buyer view and pass properties to the template
    res.render("buyer", { properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).send("Error fetching properties");
  }
});

app.get("/propertylist", (req, res) => {
  res.render("propertylist.hbs");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  await Usercollection.insertMany([data]);
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const check = await Usercollection.findOne({
      email: req.body.email,
    });
    console.log(check);
    if (check.password === req.body.password) {
      res.render("home", { check });
    } else {
      res.send("wrong password");
    }
  } catch {
    res.send("wrong details");
  }
});

app.post("/seller", async (req, res) => {
  let userId;
  try {
    userId = new mongoose.Types.ObjectId(req.body.userid);
  } catch (error) {
    console.error("Invalid userId format:", error);
    return res.status(400).send("Invalid userId format");
  }

  const data = {
    userid: userId,
    place: req.body.place,
    area: req.body.area,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    hospitals: req.body.hospitals,
    colleges: req.body.colleges,
  };
  try {
    console.log(data);
    await Propertycollection.insertMany([data]);
    res.redirect(`/seller?userid=${data.userid}`);
  } catch (error) {
    console.error("Error inserting data into Propertycollection:", error);
    res.send("Error inserting data into Propertycollection");
  }
});

app.post("/seller/properties/update", async (req, res) => {
  let propertyId;
  try {
    propertyId = new mongoose.Types.ObjectId(req.body.propertyId);
  } catch (error) {
    console.error("Invalid propertyId format:", error);
    return res.status(400).send("Invalid propertyId format");
  }

  const data = {
    place: req.body.place,
    area: req.body.area,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    hospitals: req.body.hospitals,
    colleges: req.body.colleges,
  };
  try {
    await Propertycollection.updateOne({ _id: propertyId }, data);
    res.redirect(`/seller?userid=${req.body.userid}`);
  } catch (error) {
    console.error("Error updating property:", error);
    res.send("Error updating property");
  }
});

app.post("/seller/properties/delete", async (req, res) => {
  let propertyId;
  try {
    propertyId = new mongoose.Types.ObjectId(req.body.propertyId);
  } catch (error) {
    console.error("Invalid propertyId format:", error);
    return res.status(400).send("Invalid propertyId format");
  }

  try {
    await Propertycollection.deleteOne({ _id: propertyId });
    res.redirect(`/seller?userid=${req.body.userid}`);
  } catch (error) {
    console.error("Error deleting property:", error);
    res.send("Error deleting property");
  }
});

app.post("/interest", async (req, res) => {
  try {
    const propertyId = req.body.propertyId;

    res.send("Interest expressed successfully");
  } catch (error) {
    console.error("Error expressing interest:", error);
    res.status(500).send("Error expressing interest");
  }
});

app.listen(8000, () => {
  console.log("port connected");
});
