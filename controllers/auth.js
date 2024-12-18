import bcrypt from "bcrypt";
import isUrl from "is-url";
import Customers from "../modals/customers.js";
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

    const customers = await Customers.findOne({ email });
    const match = customers && (await bcrypt.compare(password, customers?.password));

    if (!match) {
      throw new Error("Invalid login credentials.");
    }

    if (!customers?.status) {
      throw new Error("Account is inactive.");
    }

    res.status(200).json({
      success: true,
      message: "Login success",
      customers: {
        token: generateAccessToken(customers._id),
        name: customers.name,
        email: customers.email
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
    req?.customers?.profile?._raw
  );

  try {
    const customers = await Customers.findOneAndUpdate(
      { email },
      {
        name,
        email,
        status: email_verified,
      },
      { new: true, upsert: true, sort: { createdAt: -1 } }
    );

    if (!customers.status && !(await sendAccountActivationEmail(customers))) {
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

  Customers.findOne({ email: uId })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Google customers verification success",
        customers: {
          token: generateAccessToken(data._id),
          name: data.name,
          email: data.email
        },
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: "Error/ Timeout Google customers verification. Please try again",
        error: err,
      });
    });
}

export { login, googleLoginCallBack, googleUserVerify };
