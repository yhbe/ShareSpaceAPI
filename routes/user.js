const controller = require("../controller/ctrlUser")
const express = require("express")
const router = express.Router()

router.post("/", controller.post)
router.get("/", controller.getAllUsers)
router.post("/logout", controller.logOut)
router.post("/login", controller.verifyUser)
router.get("/loginWithCookies", controller.tryLoginWithCookies)
router.post("/userPost", controller.userPost)
router.post("/addComment", controller.addComment)
router.delete("/deleteComment", controller.deleteComment)
router.delete("/deletePost", controller.deletePost)
module.exports = router