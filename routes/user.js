const controller = require("../controller/ctrlUser")
const express = require("express")
const router = express.Router()

router.post("/", controller.post)
router.post("/login", controller.verifyUser)

module.exports = router