const mongoose = require("mongoose")

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
  } catch (error) {
    console.log(error)
  }
}

mongoose.connection.on("error", (err) => {
  console.log(err);
});

module.exports = connect