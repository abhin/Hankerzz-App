import bcrypt from "bcrypt";
import Users from "../models/users.js";
import { sendAccountActivationEmail } from "../utilities/function.js";

async function create(req, res) {
  const { name, email, password, status, sendEmail } = req.body;
  try {
    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const customer = await Users.create({
      name,
      email,
      password: passwordHash,
      status,
    });

    if (sendEmail && !(await sendAccountActivationEmail(customer))) {
      throw new Error(
        "Failed to send activation email. Please contact support."
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Account created successfully. Please check your email for activation.",
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
    const users = await Users.find().select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching users.",
      error: error.message,
    });
  }
}

async function update(req, res) {
  const { name, email, password, status } = req.body;
  const id = req?.authUsers?.uId;

  try {
    if (!id) throw new Error("Users ID not found.");

    const updatedFields = { name, email, status: status ?? true };

    if (password) {
      updatedFields.password = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS)
      );
    }

    const updatedUsers = await Users.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Users updated successfully.",
      customer: updatedUsers,
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
    const existingUsers = await Users.exists({ _id });

    if (!existingUsers) {
      return res.status(404).json({
        success: false,
        message: "Users does not exist.",
      });
    }

    await Users.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: `Users deleted successfully. ID: ${_id}`,
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
  const { UsersId } = req.params;

  try {
    if (!UsersId) throw new Error("Users ID not found.");

    const updatedUsers = await Users.findByIdAndUpdate(
      UsersId,
      { status: true },
      { new: true }
    );

    if (!updatedUsers) {
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
