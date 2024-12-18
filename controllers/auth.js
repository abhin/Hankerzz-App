import bcrypt from "bcrypt";
import isUrl from "is-url";
import Users from "../models/users.js";
import {
  generateAccessToken,
  sendAccountActivationEmail,
  getProfilePicUrl,
} from "../utilities/function.js";

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Invalid login.");
    }

    const users = await Users.findOne({ email });
    const match = users && (await bcrypt.compare(password, users?.password));

    if (!match) {
      throw new Error("Invalid login credentials.");
    }

    if (!users?.status) {
      throw new Error("Account is inactive.");
    }

    res.status(200).json({
      success: true,
      message: "Login success",
      users: {
        token: generateAccessToken(users._id),
        name: users.name,
        email: users.email
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}

async function googleLoginCallBack(req, res) {
  const { name, picture, email, email_verified } = JSON.parse(
    req?.users?.profile?._raw
  );

  try {
    const users = await Users.findOneAndUpdate(
      { email },
      {
        name,
        email,
        status: email_verified,
      },
      { new: true, upsert: true, sort: { createdAt: -1 } }
    );

    if (!users.status && !(await sendAccountActivationEmail(users))) {
      throw new Error(
        "Failed to send activation email. Please contact support."
      );
    }

    res.redirect(
      `${process.env.CLIENT_HOST_URL}/${generateAccessToken(email, "1d")}`
    );
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}

function googleUserVerify(req, res) {
  const { uId } = req.authUser;

  Users.findOne({ email: uId })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Google users verification success",
        users: {
          token: generateAccessToken(data._id),
          name: data.name,
          email: data.email
        },
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: "Error/ Timeout Google users verification. Please try again",
        error: err,
      });
    });
}

export { login, googleLoginCallBack, googleUserVerify };
