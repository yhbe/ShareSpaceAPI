const controller = require("../controller/ctrlUser")
const express = require("express")
const router = express.Router()

router.post("/", controller.post)
router.post("/login", controller.verifyUser)
router.get("/loginWithCookies", controller.tryLoginWithCookies)
router.post("/logout", controller.logOut)

module.exports = router