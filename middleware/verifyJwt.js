// verify jwt token middleware
const jwt = require("jsonwebtoken");
const verifyJwt = async (req, res, next) => {
  const token = req.header("Authorization");
  const bearer = token.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Auth Error" });
  }
  try {
    const decoded = jwt.verify(bearer, "kPGzq3kH48aDGD9N23Fs5T8jYqHb5GXs");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({ message: "Token is not valid" });
  }
};

module.exports = verifyJwt;
