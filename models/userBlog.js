const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  emailaddress: { type: String, required: true },
  fullname: { type: String, required: true },
  profilepicture: { type: String, required: true },
  posts: [{ type: Object }],
});

const User = mongoose.model("User", userSchema)

module.exports = User