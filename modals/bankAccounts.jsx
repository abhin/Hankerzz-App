import mongoose from "mongoose";
import { USER_ROLE_CUSTOMER, USER_ROLE_VENDOR } from "../utilities/constants.js";

const bankAccountDetailsSchema = mongoose.Schema({
    bankAccountNo: {
        type: String,
        required: true,
        index: true
    },
    bankAccountName: {
        type: String,
        required: true
    },
    sortCode: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    userRole: {
        type: String,
        required: true,
        enum: [USER_ROLE_CUSTOMER, USER_ROLE_VENDOR],
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userRole',
        required: true
    }
}, { timestamps: true });

bankAccountDetailsSchema.index({ userID: 1, userRole: 1 });

const BankAccountDetails = mongoose.model('BankAccountDetails', bankAccountDetailsSchema);

export default BankAccountDetails;
