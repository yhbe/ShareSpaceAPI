const controller = require("../controller/ctrlUser")
const express = require("express")
const router = express.Router()

router.post("/", controller.post)
router.get("/", controller.getAllUsers)
router.post("/logout", controller.logOut)
router.post("/login", controller.verifyUser)
router.get("/loginWithCookies", controller.tryLoginWithCookies)

module.exports = router