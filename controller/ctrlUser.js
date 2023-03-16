const User = require("../models/userBlog")
const bcrypt = require("bcrypt")

module.exports = {
  post: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      const newUser = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        emailaddress: req.body.emailaddress,
        password: hashedPassword
      })

      await newUser.save()
      return res.status(201).json({ message: "User created", newUser });
    } catch (error) {
      return res.status(404).json({message: error.message})
    }
  },
};
