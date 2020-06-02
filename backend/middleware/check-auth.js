const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "this_can_literally_be_anything_lol");
    req.userData = {email: decodedToken.email, userID: decodedToken.userID};
    next();
  } catch(err) {
    res.status(401).json({
      message: "You are not authenticated!"
    });
  }
};
