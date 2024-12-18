import bcrypt from "bcrypt";
import Customers from "../modals/customers.js";
import { sendAccountActivationEmail } from "../utilities/function.js";

async function create(req, res) {
  const { name, email, password, status, sendEmail } = req.body;
  try {
    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const customer = await Customers.create({
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
    const customers = await Customers.find().select("-password");
    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching customers.",
      error: error.message,
    });
  }
}

async function update(req, res) {
  const { name, email, password, status } = req.body;
  const id = req?.authUser?.uId;

  try {
    if (!id) throw new Error("User ID not found.");

    const updatedFields = { name, email, status: status ?? true };

    if (password) {
      updatedFields.password = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS)
      );
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
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
  const { userId } = req.params;

  try {
    const updatedCustomer = await Customers.findByIdAndUpdate(userId, {
      status: true,
    });

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
