const PROFILE = require("../models/profle");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// create an account
const handleRegister = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const userExist = await PROFILE.findOne({ email });
    if (userExist) {
      return res.status(400).json({ err: "The account is already in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await PROFILE.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// login account
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ message: "Provide all values" });
    }

    // check if it has been initially registered

    const user = await PROFILE.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "This email has not been registered" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(200).json({
      success: true,
      token: token,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
module.exports = { handleRegister, handleLogin };
