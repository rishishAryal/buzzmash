const User = require("../model/User");
const Follow = require("../model/Follow");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");

const jwt = require("jsonwebtoken");
const { profile } = require("console");

// Register a new user
const register = async (req, res) => {
  const { name, username, email, password, DOB } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      DOB,
    });
    await newUser.save();
    const jwtToken = jwt.sign(
      { userId: newUser._id },
      "kPGzq3kH48aDGD9N23Fs5T8jYqHb5GXs",
      { expiresIn: "10d" }
    );
    //expiresIn 10 days
    // expiresIn: "10d"
    res.status(201).json({
      message: "User Registered",
      jwtToken,
      user: newUser,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const checkIfUsernameAvailable = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(200)
        .json({ message: "Username Already Exists", isAvailable: false });
    }
    res.status(200).json({ message: "Username Available", isAvailable: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const checkIfEmailAvailable = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ message: "Email Already Exists", isAvailable: false });
    }
    res.status(200).json({ message: "Email Available", isAvailable: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Exist" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const jwtToken = jwt.sign(
      { userId: user._id },
      "kPGzq3kH48aDGD9N23Fs5T8jYqHb5GXs",
      { expiresIn: "10d" }
    );
    res
      .status(201)
      .json({ message: "User Login", jwtToken, user: user, success: true });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    //get total followers and following
    const followers = await Follow.find({ following: req.userId });
    const following = await Follow.find({ follower: req.userId });
    user.followerCount = followers.length;
    user.followingCount = following.length;
    await user.save();
    res.status(200).json({ message: "User Profile Fetched", profile: user });
  } catch (err) {
    res.json(err);
  }
};
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json({ message: "User Logged Out", profile: decoded });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
      return res
        .status(400)
        .json({ message: "Incorrect Password", success: true });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password Changed", success: true });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const updateUserDetails = async (req, res) => {
  const { name, username, profile, instagram, twitter, facebook } = req.body;
  try {
    const user = await User.findById(req.userId);
    user.name = name || user.name;
    user.username = username || user.username;
    user.profilePicture = profile || user.profilePicture;
    user.instagram = instagram || user.instagram;
    user.twitter = twitter || user.twitter;
    user.facebook = facebook || user.facebook;
    user.DOB = user.DOB;
    user.email = user.email;

    await user.save();
    res
      .status(200)
      .json({ message: "User Details Updated", user: user, success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const checkifLogin = async (req, res) => {
  const token = req.header("Authorization");
  const bearer = token.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Auth Error", login: false });
  }
  try {
    const decoded = jwt.verify(bearer, "kPGzq3kH48aDGD9N23Fs5T8jYqHb5GXs");
    req.userId = decoded.userId;
    return res.status(200).json({ message: "Token is valid", login: true });
  } catch (err) {
    console.log(err.message);

    return res
      .status(500)
      .json({ message: "Token is not valid", login: false });
  }
};
const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  console.log("spload");
  console.log(req.userId);

  // Create a readable stream from the buffer
  const readableInstanceStream = new stream.Readable({
    read() {
      this.push(req.file.buffer);
      this.push(null); // Signal the end of the stream
    },
  });

  try {
    // Upload the image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profilePicture", resource_type: "image" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false,
          });
        }
        // Assuming `User` is your User model and you have a way to get `userId`
        const user = await User.findById(req.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.profilePicture = result.secure_url;
        await user.save();

        res.json({
          message: "Profile picture uploaded successfully!",
          success: true,
          profilePicture: result.secure_url,
        });
      }
    );

    // Pipe the readable stream to Cloudinary
    readableInstanceStream.pipe(uploadStream);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
};

const searchUser = async (req, res) => {
  const { search } = req.body;
  // search user name and username and return the user
  try {
    const userDTO = [];
    const user = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    });
    // also check for is the user following the searched user
    for (let i = 0; i < user.length; i++) {
      //skip the user itself
      if (user[i]._id.toString() === req.userId) {
        continue;
      }
      const isFollowing = await Follow.findOne({
        follower: req.userId,
        following: user[i]._id,
      });
      if (isFollowing) {
        userDTO.push({
          id: user[i]._id,
          name: user[i].name,
          username: user[i].username,
          profilePicture: user[i].profilePicture,
          isFollowing: true,
        });
      } else {
        userDTO.push({
          id: user[i]._id,
          name: user[i].name,
          username: user[i].username,
          profilePicture: user[i].profilePicture,
          isFollowing: false,
        });
      }
    }

    res
      .status(200)
      .json({ message: "User Fetched", user: userDTO, success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  logout,
  changePassword,
  checkIfUsernameAvailable,
  checkIfEmailAvailable,
  updateUserDetails,
  checkifLogin,
  uploadProfilePicture,
  searchUser
};
