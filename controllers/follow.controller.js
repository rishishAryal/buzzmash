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
    //get the follwing user details

    user.followerCount = user.followerCount + 1;
    await user.save();

    const ownUser = await User.findById(userId);
    ownUser.followingCount = ownUser.followingCount + 1;
    await ownUser.save();

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
    const follow = await Follow.findOneAndDelete({
      follower: userId,
      following,
    });
    if (!follow) {
      return res.status(200).json({ message: "Not Following", success: false });
    }
    user.followerCount = user.followerCount - 1;
    await user.save();

    const ownUser = await User.findById(userId);
    ownUser.followingCount = ownUser.followingCount - 1;
    await ownUser.save();

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

    var followersDetail = [];

    // console.log(followers[0].following.toString());

    for (let i = 0; i < followers.length; i++) {
      //array of user details of followers only put
      const follower = await User.findById(followers[i].follower);

      const isFollowing = await Follow.findOne({
        follower: userId,
        following: followers[i].follower,
      });
      if (isFollowing) {
        followers[i].isFollowing = true;
        followersDetail.push({
          id: follower._id,
          username: follower.username,
          email: follower.email,
          profilePicture: follower.profilePicture,
          isFollowing: true,
        });
      } else {
        followers[i].isFollowing = false;
        followersDetail.push({
          id: follower._id,
          username: follower.username,
          email: follower.email,
          profilePicture: follower.profilePicture,
          isFollowing: false,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Followers",
      followers: followersDetail,
    });
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
    const following = await Follow.find({ follower: userId });
    // console.log(following);
    var followingDetails = [];

    for (let i = 0; i < following.length; i++) {
      const follwingUser = await User.findById(following[i].following);

      followingDetails.push({
        id: follwingUser._id,
        username: follwingUser.username,
        email: follwingUser.email,
        profilePicture: follwingUser.profilePicture,
        isFollowing: true,
      });
    }
    res.status(200).json({
      following: followingDetails,
      success: true,
      message: "Following",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports = { follow, unFollow, getFollowers, getFollowing };
