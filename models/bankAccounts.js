import mongoose from "mongoose";

const bankAccountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sortCode: {
      type: String,
      required: true,
      index: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    bankAddress: {
      type: String,
      required: true,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ["Current", "Savings"],
      required: true,
      index: true,
    },
    iban: {
      type: String,
      index: true,
    },
    swiftBicCode: {
      type: String,
      index: true,
    },
    currency: {
      type: String,
      default: "GBP",
    },
  },
  { timestamps: true }
);

const bankAccounts = mongoose.model("bankAccounts", bankAccountSchema);

export default bankAccounts;