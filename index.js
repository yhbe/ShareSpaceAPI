require("dotenv").config()
const express = require("express")
const app = new express()
const connect = require("./utils/db")
const cors = require("cors")
const bodyParser = require("body-parser")
const port = process.env.PORT || 5000
const cookieParser = require("cookie-parser")

connect()
app.use(express.json())
app.use(cookieParser())
// Allow requests from any origin with credentials
app.use(cors({origin: true, credentials: true}))
app.use(bodyParser.urlencoded({extended: true}))

const userRoute = require("./routes/user")
app.use("/users", userRoute)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})