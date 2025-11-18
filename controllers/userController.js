const User = require("../models/User");
const UserFollow = require("../models/UserFollow");
const mongoose = require('mongoose')
exports.updatePrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found or account deleted.",
        error: {},
      });
    }
    // Toggle isPrivate (true -> false, false -> true)
    user.isPrivate = !user.isPrivate;
    await user.save();
    return res.status(200).json({
      status: true,
      data: user,
      message: `Privacy updated successfully. Profile is now ${
        user.isPrivate ? "Private" : "Public"
      }.`,
      error: {},
    });
  } catch (error) {
    console.error("updatePrivacy error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating user privacy.",
      error: error.message,
    });
  }
};

exports.userFollow = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = req.body.followingId;
    if (followerId === followingId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "User cannot follow itself.",
        error: {},
      });
    }
    const followingUser = await User.findOne({
      _id: followingId,
      isDeleted: false,
    }).select("isPrivate");
    if (!followingUser) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found.",
        error: {},
      });
    }
    const existingFollow = await UserFollow.findOne({
      followerId,
      followingId,
      isDeleted: false,
    });
    if (existingFollow) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: `You are already ${existingFollow.status} this user.`,
        error: {},
      });
    }
    // If user profile is private → pending, else → accepted
    let followStatus = followingUser.isPrivate ? "pending" : "accepted";
    // 5️⃣ Create follow record
    const newFollow = await UserFollow.findOneAndUpdate(
      { followerId, followingId },
      {
        $set: {
          status: followStatus,
          isDeleted: false,
          createdAt: new Date(),
          respondedAt: null,
        },
      },
      { upsert: true, new: true }
    );
    return res.status(200).json({
      status: 200,
      data: newFollow,
      message:
        followStatus === "pending"
          ? "Follow request sent successfully."
          : "User followed successfully.",
      error: {},
    });
  } catch (error) {
    console.error("userFollow error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating user follow requests.",
      error: error.message,
    });
  }
};

exports.userUnFollow = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = req.body.followingId;
    if (followerId === followingId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "User cannot unfollow itself.",
        error: {},
      });
    }
    const followingUser = await User.findOne({
      _id: followingId,
      isDeleted: false,
    });
    if (!followingUser) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found.",
        error: {},
      });
    }
    const existingFollow = await UserFollow.findOne({
      followerId,
      followingId,
      isDeleted: false,
    });
    if (!existingFollow) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "You does not follow this user",
        error: {},
      });
    }
    existingFollow.isDeleted = true;
    await existingFollow.save();
    return res.status(200).json({
      status: 200,
      data: {},
      message: "User unfollowed successfully",
      error: "",
    });
  } catch (error) {
    console.error("userUnFollow error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating user unfollow requests.",
      error: error.message,
    });
  }
};

exports.followersList = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found",
        error: {},
      });
    }
    const followerCount = await UserFollow.aggregate([
  // Stage 1: Match the conditions
  {
    $match: {
      followingId: new mongoose.Types.ObjectId(req.userId),
      isDeleted: false,
      status: "accepted",
    },
  },
  // Stage 2: Join with User collection
  {
    $lookup: {
      from: "users", // collection name (lowercase, plural)
      localField: "followingId", // field from UserFollow
      foreignField: "_id", // field from User
      as: "userDetails", // output array name
    },
  },
  // Stage 3: Flatten the userDetails array
  {
    $unwind: "$userDetails",
  },
  // Stage 4: Project the fields you want
  {
    $project: {
      _id: 1,
      followingId: 1,
      status: 1,
      createdAt: 1, // if needed
      followersName: "$userDetails.name", // or $userDetails.firstName, etc.
      followersEmail: "$userDetails.email", // add other user fields if needed
      // OR to include entire user object:
      // userDetails: 1,
    },
  },
]);
    return res.status(200).json({
      status:200,
      data:followerCount,
      message:"User follower list",
      error:{}
    })
  } catch (error) {
    console.error("userFollowerList error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating user follower list.",
      error: error.message,
    });
  }
};

exports.followingList = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found",
        error: {},
      });
    }
    const followerCount = await UserFollow.aggregate([
  // Stage 1: Match the conditions
  {
    $match: {
      followerId: new mongoose.Types.ObjectId(req.userId),
      isDeleted: false,
      status: "accepted",
    },
  },
  // Stage 2: Join with User collection
  {
    $lookup: {
      from: "users", // collection name (lowercase, plural)
      localField: "followingId", // field from UserFollow
      foreignField: "_id", // field from User
      as: "userDetails", // output array name
    },
  },
  // Stage 3: Flatten the userDetails array
  {
    $unwind: "$userDetails",
  },
  // Stage 4: Project the fields you want
  {
    $project: {
      _id: 1,
      followingId: 1,
      status: 1,
      createdAt: 1, // if needed
      followersName: "$userDetails.name", // or $userDetails.firstName, etc.
      followersEmail: "$userDetails.email", // add other user fields if needed
      // OR to include entire user object:
      // userDetails: 1,
    },
  },
]);
    return res.status(200).json({
      status:200,
      data:followerCount,
      message:"User follower list",
      error:{}
    })
  } catch (error) {
    console.error("userFollowingList error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating user following list.",
      error: error.message,
    });
  }
};

exports.requestList = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found",
        error: {},
      });
    }
    const followerCount = await UserFollow.aggregate([
  // Stage 1: Match the conditions
  {
    $match: {
      followingId: new mongoose.Types.ObjectId(req.userId),
      isDeleted: false,
      status: "pending",
    },
  },
  // Stage 2: Join with User collection
  {
    $lookup: {
      from: "users", // collection name (lowercase, plural)
      localField: "followingId", // field from UserFollow
      foreignField: "_id", // field from User
      as: "userDetails", // output array name
    },
  },
  // Stage 3: Flatten the userDetails array
  {
    $unwind: "$userDetails",
  },
  // Stage 4: Project the fields you want
  {
    $project: {
      _id: 1,
      followingId: 1,
      status: 1,
      createdAt: 1, // if needed
      followersName: "$userDetails.name", // or $userDetails.firstName, etc.
      followersEmail: "$userDetails.email", // add other user fields if needed
      // OR to include entire user object:
      // userDetails: 1,
    },
  },
]);
    return res.status(200).json({
      status:200,
      data:followerCount,
      message:"User follow request list",
      error:{}
    })
  }catch (error) {
    console.error("userRequestList error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating user request list.",
      error: error.message,
    });

  }
};

exports.requestAction = async (req, res) => {
  try {
    const followingId = req.body.followingId;
    const status = req.body.status;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found",
        error: {},
      });
    }
    const userRequests = await UserFollow.findOne({
      followerId:req.userId,
      followingId:followingId,
      status:"pending",
      isDeleted:false
    })
    if(userRequests){
     const result = await UserFollow.findByIdAndUpdate(
        userRequests._id,
        { status: status },
        { new: true }  // Returns the updated document
      );
    return res.status(200).json({
      status:200,
      data:result,
      message:`User requests ${status} successfully`,
      error:{}
    })
    }else{
      return res.status(400).json({
      status:400,
      data:{},
      message:"User requests not found",
      error:{}
    })
    }

  } catch (error) {
    console.error("requestAction error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating user requests action.",
      error: error.message,
    });

  }
}