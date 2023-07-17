import mongoose from 'mongoose';
const {Schema} = mongoose

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    interest: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    years: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
    ,
    userEmail: {
        type: String,
        required: true,
    }
}, { timestamps: true })

export default mongoose.model("Product", ProductSchema)