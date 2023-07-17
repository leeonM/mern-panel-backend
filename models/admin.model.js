import mongoose from 'mongoose';
const {Schema} = mongoose

const AdminSchema = new Schema({
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
    isAdmin: {
        type: Boolean,
        required: false
    }
}, { timestamps: true })

export default mongoose.model("Admin", AdminSchema)