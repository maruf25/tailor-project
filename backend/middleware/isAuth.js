const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = (role) => (req, res, next) => {
  // const authHeader = req.get("Authorization");
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  // const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  if (role.includes(decodedToken.role)) {
    req.userId = decodedToken.userId;
    req.role = decodedToken.role;
    next();
  } else {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }
};
