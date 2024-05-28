const { jsonwebtoken: jwt, JWT_SECRET, } = require("../../constants");
const User = require('../models/User');


module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.id;
      const username = decodedToken.username;

      if (!userId || !username) {
        return res.status(403).json({
          message: "unauthorized user",
        });
      } else {
        const findUser = await User.findOne({ _id: userId });
        if (!findUser) {
          return res.status(400).json({
            status: 400,
            data: {},
            message: "User not found",
          });
        }

        req.me = decodedToken;

        return next();
      }
    } else {
      return res.status(403).json({
        message: "unauthorized user",
      });
    }
  } catch (err) {
    return res.status(401).json({
      error: err,
      message: "Auth token is missing",
    });
  }
};