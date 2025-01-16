const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcryptjs = require("bcryptjs");
const { BadRequest, Unauthenticated } = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // if (!name || !email || !password) {
  //   throw new BadRequest("please provide all necessary fields.!");
  // }
  const user = await User.create({ ...req.body });
  const token = await user.createToken();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("please provide email and password");
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new BadRequest("Bad Credentials.!");
  }
  const isMatch = bcryptjs.compare(password, user.password);

  if (!isMatch) {
    throw new BadRequest("Bad Credentials.!");
  }

  const token = await user.createToken();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
