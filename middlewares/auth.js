const jwt = require("jsonwebtoken");
const User = require("../models").User;
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    // const token = req.headers['authorization'];
    // console.log('REQ-----------------------', req.headers.cookie);
    // const token = req.cookies.jwt;

    const s = req.headers.cookie;
    const token = s.split("jwt=")[1].split(";")[0].trim();
    // console.log('AUTH TOKEN-------------', token);

    if (!token) {
      throw new Error("Authorization header missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('DECODED-------------------------', decoded);
    const user = await User.findOne(
      {
        where: {
          id: decoded.id,
        //   "tokens.token": token,
        },
      }
    );
    // console.log('USER LOG------------------------', user);

    if (!user) {
      throw new Error("User not found");
    }

    const tokenExists = user.tokens.some((t) => t.token === token);
    if (!tokenExists) {
        return res.status(401).send("Invalid Token");
    }

    req.token = token;
    req.user = user;
    // req.role = decoded.role;

    next();

  } catch (e) {
    res.status(500).send("Please Authenticate");
    console.log(`ERROR:-------------- ${e}`);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied");
  }
  next();
};

module.exports = { auth, isAdmin };