import bcrypt from "bcrypt";
import Customers from "../modals/customers.js";
import { sendAccountActivationEmail } from "../utilities/function.js";
import jwt from "jsonwebtoken";

async function create(req, res) {
  const { name, email, password, profilePic, active, sendEmail } = req.body;
  try {
    const existingUser = await Customers.exists({ email });

    if (existingUser) {
      throw new Error("Customer already exists.");
    }

    const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

    const customer = await Customers.create({
      name,
      email,
      password: passwordHash,
      profilePic,
      active,
    });

    if (sendEmail && !(await sendAccountActivationEmail(customer))) {
      throw new Error("Failed to send activation email. Please contact support.");
    }

    return res.status(200).json({
      success: true,
      message: "Account created successfully. Please check your email for activation.",
      customer,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const data = await Customers.find();
    res.status(200).json({ success: true, customers: data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching customers.",
      error: error.message,
    });
  }
}

async function update(req, res) {
  const { name, email, password, active } = req.body;
  const profilePic = req?.file?.location || req?.file?.path;
  const token = req.headers.authorization;
  const id = req?.authUser?.uId;

  try {
    const existingUser = await Customers.exists({ email, _id: { $ne: id } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already used.",
      });
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password,
        active: active ?? true,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error during customer update.",
      error: error.message,
    });
  }
}

async function deleteUser(req, res) {
  const { _id } = req.params;

  try {
    const existingUser = await Customers.exists({ _id });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Customer does not exist.",
      });
    }

    await Customers.findByIdAndDelete(_id);
    res.status(200).json({
      success: true,
      message: `Customer deleted successfully. ID: ${_id}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error occurred while deleting customer.",
      error: error.message,
    });
  }
}

async function activate(req, res) {
  const { token } = req.params;
  let data;

  try {
    if (!token) throw new Error("Unauthorized access.");

    await jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) throw new Error("Invalid token.");
      data = decoded;
    });

    const customer = await Customers.findById(data?.uId);

    if (customer?.active) {
      return res.status(400).json({
        success: false,
        message: "Account already activated.",
      });
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(data?.uId, { active: true });

    if (!updatedCustomer) {
      throw new Error("Activation failed. Invalid URL.");
    }

    res.status(200).json({
      success: true,
      message: "Account activated successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export { create, getAllUsers, update, deleteUser, activate };
