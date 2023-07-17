import mongoose from 'mongoose';
const {Schema} = mongoose
import crypto from 'crypto';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    fName: {
        type: String,
        required: false,
    },
    lName: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    postcode: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    accountNumber: {
        type: String,
        required: false,
    },
    sortCode: {
        type: String,
        required: false,
    },
    products: {
        type:[],
        required: false,
    }
}, { timestamps: true })

export default mongoose.model("User", UserSchema)