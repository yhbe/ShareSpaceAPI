const User = require("../models/userBlog")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = {
  post: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const initials = req.body.username
          .split(" ")
          .map((name) => name[0])
          .join("");
        const profilePictureUrl = `https://ui-avatars.com/api/?background=random&color=fff&name=${initials}&rounded=true`;

      const newUser = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        emailaddress: req.body.emailaddress,
        profilepicture: profilePictureUrl,
        password: hashedPassword,
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return res.status(201)
                .cookie("logInToken", token, {
          httpOnly: true,
          secure: true
        })       .json({ message: "User created", newUser });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(404).json({ message: "User  not found" });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const userToSend = {
        username: user.username,
        fullname: user.fullname,
        emailaddress: user.emailaddress,
        profilepicture: user.profilepicture,
        id: user._id,
      };

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return res
        .status(200)
        .cookie("logInToken", token, {
          httpOnly: true,
          secure: true
        })
        .json({ message: "User Found", user: userToSend });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  tryLoginWithCookies: async (req, res) => {
    try {
      const token = req.cookies.logInToken;
      if (!token) {
        return res.status(401)
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userToSend = {
        username: user.username,
        fullname: user.fullname,
        emailaddress: user.emailaddress,
        profilepicture: user.profilepicture,
        id: user._id,
      };
      return res.status(200).json({ message: "User Found", user: userToSend });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(500).json({ message: error.message });
    }
  },
  logOut: async(req,res) => {
    try {
      res.clearCookie("logInToken");
      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllUsers: async(req,res) => {
    try {
      const allUsers = await User.find();
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
