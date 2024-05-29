const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Rentify")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((error) => {
    console.log("mongodb failed to connect", error);
  });

const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const SellerSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LoginCollection",
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  hospitals: {
    type: Number,
    required: true,
  },
  colleges: {
    type: Number,
    required: true,
  },
});

const Usercollection = mongoose.model("LoginCollection", LoginSchema);
const Propertycollection = mongoose.model("PropertyCollection", SellerSchema);

module.exports = { Usercollection, Propertycollection };
