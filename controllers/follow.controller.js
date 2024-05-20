const Follow = require("../model/Follow");
const User = require("../model/User");

const follow = async (req, res) => {
  try {
    const userId = req.userId;
    const { following } = req.body;
    const user = await User.findById(following);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found", success: false });
    }
    if (userId === following) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself", success: false });
    }
    const follow = await Follow.findOne({
      follower: userId,
      following,
    });
    if (follow) {
      return res
        .status(200)
        .json({ message: "Already Following", success: false });
    }
    const newFollow = new Follow({
      follower: userId,
      following,
    });
    await newFollow.save();
    res.status(201).json({ message: "Followed", success: true });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
};

const unFollow = async (req, res) => {
  try {
    const userId = req.userId;
    const { following } = req.body;
    const user = await User.findById(following);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found", success: false });
    }
    if (userId === following) {
      return res
        .status(400)
        .json({ message: "You cannot unfollow yourself", success: false });
    }
    const follow = await Follow.findOne({
      follower: userId,
      following,
    });
    if (!follow) {
      return res.status(200).json({ message: "Not Following", success: false });
    }
    await follow.delete();

    res.status(200).json({ message: "Unfollowed", success: true });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
      success: false,
    });
  }
};
const getFollowers = async (req, res) => {
  try {
    const userId = req.userId;
    const followers = await Follow.find({ following: userId });

    console.log(followers[0].following.toString());

    for (let i = 0; i < followers.length; i++) {
      var followerId = followers[i].follower.toString();
      if (followerId == userId) {
        followers[i].isFollowing = true;
      }
    }

    res.status(200).json({ followers, success: true, message: "Followers" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.userId;
    const following = await Follow.find({ follower: userId }).populate(
      "following"
    );
    //check while fetching the following of a user if that the user is Following his following and if is following then set isFollowing to true
    following.forEach((follow) => {
      follow.isFollowing = true;
    });
    res.status(200).json({ following, success: true, message: "Following" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports = { follow, unFollow, getFollowers, getFollowing };
