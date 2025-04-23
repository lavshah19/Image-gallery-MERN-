const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
const registerUser = async (req, res) => {
  try {
    //extract user info from our req body
    const { username, email, password, role } = req.body;

    // check if user is already exist in the database
    const checkExisingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExisingUser) {
      return res.status(400).json({
        success: false,
        message:
          "user is already exist please try with different username and email",
      });
    }
    //hash the password remember
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    //create a new user and save in a database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newlyCreatedUser.save();
    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "user register successfuly",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "unable to user register ",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured ! please try again",
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //find if the current user is register or not in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials user not exist",
      });
    }
    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //bearer token
    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id, // yo ra userInfo ko same huna parxa jwt
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );
    res.status(200).json({
      success: true,
      message: "Loggin successful",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured ! please try again",
    });
  }
};
//change password controller
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new password;
    const { oldPassword, newPassword } = req.body;

    //find the current logged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //check if the old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct! Please try again.",
      });
    }
    // hash new password
    const salt = await bcrypt.genSalt(10);

    const newHashedPassword= await bcrypt.hash(newPassword, salt);
    user.password = newHashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured ! please try again",
    });
  }
};
module.exports = { registerUser, loginUser,changePassword };
