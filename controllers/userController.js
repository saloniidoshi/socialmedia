const User = require("../models/User");

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
    return res.status(500).json({
      status: 500,
      data: {},
      message: "Server error while updating user privacy.",
      error: error.message,
    });
  }
};
