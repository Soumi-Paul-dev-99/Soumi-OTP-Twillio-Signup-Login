const User = require("../models/userModel");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/email");
const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const cloudinary = require("../utils/cloudinary");

///for user signup

exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password, number, message } =
      req.body;

    const upload = await cloudinary.v2.uploader.upload(req.file.path);

    if (!(first_name && last_name && email && password && number && message)) {
      res.status(400).send("all fields are required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      message,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      number,
      file: upload.secure_url,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "3h",
      }
    );
    user.token = token;

    const messageemail = "Account created successfully 🎉🌹";
    await sendEmail(user.email, "Message from Soumi", messageemail);
    res.status(200).json({
      success: true,
      message: `user register successfully please check your gmail ${user.email}`,
      token: token,
    });
  } catch (err) {
    console.log(err);
  }
};

//for login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!(email && password)) {
      res.status(400).send("all fields are required");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "3h",
        }
      );
      user.token = token;
    }
    res.status(400).send();
  } catch (error) {
    console.log("error");
  }
};

//twilio acc for otp send in phone
exports.test = (req, res) => {
  res.status(200).send({
    message: "You are on Homepage",
    info: {
      login:
        "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
      verify:
        "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code",
    },
  });
};

exports.signin = (req, res) => {
  if (req.query.phonenumber) {
    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({
        to: `+${req.query.phonenumber}`,
        channel: req.query.channel === "call" ? "call" : "sms",
      })
      .then((data) => {
        res.status(200).send({
          message: "Verification is sent!!",
          phonenumber: req.query.phonenumber,
          data,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({
          message: "Error sending verification",
          error: error.message,
        });
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.query.phonenumber,
    });
  }
};

//verify endpoint
exports.verify = (req, res) => {
  if (req.query.phonenumber && req.query.code.length === 6) {
    client.verify.v2
      .services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({
        to: `+${req.query.phonenumber}`,
        code: req.query.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          res.status(200).send({
            message: "User is verified!!",
            data,
          });
        }
      });
  } else {
    res.status(400).send({
      message: "wrong phn number or code :(",
      phonenumber: req.query.phonenumber,
      data,
    });
  }
};
