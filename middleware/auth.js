const { Unauthorized } = require("../errors");
const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Unauthorized("Unauthorized Request.!");
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: decoded.id, name: decoded.name };

    next();
  } catch (error) {
    throw new Unauthorized("Invalid or expired token.!");
  }
};

module.exports = authorize;
