const User = require("../models/userBlog")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {v4: uuidv4} = require("uuid")

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
        friends: [],
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return res
        .status(201)
        .cookie("logInToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({ message: "User created", newUser });
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
        posts: user.posts,
        friends: user.friends,
        id: user._id,
      };

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      return res
        .status(200)
        .cookie("logInToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
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
        return res.status(401);
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
        posts: user.posts,
        friends: user.friends,
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
  logOut: async (req, res) => {
    try {
      res.clearCookie("logInToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find();
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  userPost: async (req, res) => {
    try {
      const authorId = req.body.author;
      const content = req.body.content;
      const user = await User.findOne({ _id: authorId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.posts = user.posts || [];

      const post = {
        content: content,
        likes: [],
        comments: [],
      };

      user.posts.push(post);
      await user.save();

      return res.status(200).json({ message: "Post added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  addComment: async (req, res) => {
    try {
      const { postid, postindex, postuser, userprofilepicture } = req.body;

      const user = await User.findById(postuser);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const commentText = req.body.usercomment;

      const comment = {
        user: req.body.user,
        userid: req.body.userid,
        text: commentText,
        profilepicture: userprofilepicture,
        id: uuidv4(),
      };

      user.posts[postindex].comments.push(comment);

      await user.save();

      return res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { commentId, postId, userId } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const post = user.posts.id(postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const comment = post.comments.find((comment) => comment.id === commentId);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      post.comments.pull(comment);

      await user.save();

      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { postId, userId } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const postIndex = user.posts.findIndex((post) => post._id == postId);

      if (postIndex < 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      user.posts.splice(postIndex, 1);

      await user.save();

      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  sendFriendRequest: async (req, res) => {
    try {
      const { userId, loggedInUserId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const targetUser = await User.findById(loggedInUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "Target user not found" });
      }

      // Add the friend request to the target user's list
      targetUser.friends.push({
        userId: userId,
        status: "pending",
        receiver: true,
      });
      await targetUser.save();

      // Add the sent friend request to the current user's list
      user.friends.push({
        userId: targetUser.id,
        status: "pending",
        receiver: false,
      });
      await user.save();

      return res
        .status(200)
        .json({ message: "Friend request sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  acceptFriendRequest: async (req, res) => {
    try {
      const { userId, loggedInUserId } = req.body;

      const user = await User.findById(loggedInUserId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({ error: "Target user not found" });
      }

      const friendRequest = targetUser.friends.find(
        (friend) =>
          friend.userId === loggedInUserId &&
          friend.status === "pending"
      );
      if (!friendRequest) {
        return res.status(404).json({ error: "Friend request not found" });
      }

      friendRequest.status = "accepted";
      await targetUser.save();

      const sentRequest = user.friends.find(
        (friend) =>
          friend.userId === userId &&
          friend.status === "pending"
      );
      if (!sentRequest) {
        return res.status(404).json({ error: "Sent friend request not found" });
      }
      
      sentRequest.status = "accepted";
      await user.save();
      return res
        .status(200)
        .json({ message: "Friend request accepted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
