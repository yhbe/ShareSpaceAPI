const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  likes: {type: Array},
  comments: {type: Array},
  content: {type: String},
  profilepicture: {type: String},
  id: {type: String}
})

const friendSchema = new mongoose.Schema({
  username: { type: String},
  userId: { type: String},
  receiver: {type: String},
  status: {
    type: String,
    enum: ["pending", "accepted"],
  },
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  emailaddress: { type: String, required: true },
  fullname: { type: String, required: true },
  profilepicture: { type: String, required: true },
  posts: [postSchema],
  friends: [friendSchema],
});

const User = mongoose.model("User", userSchema)

module.exports = User