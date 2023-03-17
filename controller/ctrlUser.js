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
  verifyUser: async(req,res) => {
    try {
      const user = await User.findOne({username: req.body.username})

      if (!user) {
        return res.status(404).json({message: "User  not found"})
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password)

      if (!isMatch){
        return res.status(401).json({message: "Invalid credentials"})
      }

      const userToSend = {
        username: user.username,
        fullname: user.fullname,
        emailaddress: user.emailaddress,
        id: user._id
      };

      return res.status(200).json({message: "User Found", user: userToSend})
    } catch (error){
      return res.status(500).json({message: error.message})
    }
  }
};
