import Admin from "../models/admin.model.js";
import Product from "../models/product.model.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res)=>{
    try {
        const admin = await Admin.findOne({email: req.body.email})
        if (admin) return res.status(404).send("Email already in use")
        if (req.body.password.length < 6) return res.status(404).send("Password length must be 6 characters or more")
        const hash = bcrypt.hashSync(req.body.password, 5)
        const newAdmin = new Admin({
            email: req.body.email,
            password: hash,
            isAdmin: true,
        })   
       await newAdmin.save()
       res.status(200).send("Admin has been created successfully");
    } catch (error) {
        res.status(500).send(error)
    }
}

export const login = async (req, res)=>{
    try {
        const admin = await Admin.findOne({email: req.body.email})
        if(!admin) return res.status(404).send("user not found")

        const validPassword = await bcrypt.compare(req.body.password, admin.password)
        if (!validPassword) return res.status(400).send("username or password is invalid")

        const token = jwt.sign({
        id: admin._id,
    }, process.env.JWT_KEY)

    const {password, ...other} = admin._doc
    res.cookie("accessToken", token, {httpOnly: true}).status(200).send(other)
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}

export const addProduct = async (req, res, next)=> {
  try {
    const newProduct = new Product({
    userEmail: req.body.email,
    ...req.body,
  });
    const savedProduct = await newProduct.save();
    await User.findOneAndUpdate({email: newProduct.userEmail},{ '$addToSet': { products: newProduct }})
    res.status(201).json(savedProduct);
  } catch (err) {
    console.log(err)
  }
}

export const updateUser = async (req, res, next)=>{
  try {
    const updatedUser = await User.findOneAndUpdate(
      {email: req.body.email},
      {
        $set: req.body,
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error)
  }
}