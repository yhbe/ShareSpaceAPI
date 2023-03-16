require("dotenv").config()
const express = require("express")
const app = new express()
const connect = require("./utils/db")
const cors = require("cors")
const port = process.env.PORT || 5000


connect()
app.use(cors())
app.use(express.json())

const userRoute = require("./routes/user")
app.use("/users", userRoute)

app.listen(5000, () => {
  console.log(`Listening on port ${port}`)
})