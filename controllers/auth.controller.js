import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import otpGenerator from "otp-generator"
import { google } from "googleapis"
import dotenv from "dotenv"
dotenv.config()

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const register = async (req, res)=>{
    const {email, fName, lName, address, postCode, sortCode, accountNumber,phone} = req.body
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) return res.status(404).send("Email already in use")
        if (req.body.password.length < 6) return res.status(404).send("Password length must be 6 characters or more")
        const hash = bcrypt.hashSync(req.body.password, 5)
        const newUser = new User({
            email: email,
            password: hash,
            fName: fName,
            lName: lName,
            address: address,
            postCode: postCode,
            sortCode: sortCode,
            accountNumber: accountNumber,
            phone: phone,
        })   
       await newUser.save()
       res.status(200).send("User has been created successfully");
    } catch (error) {
        res.status(500).send(error)
    }
}

export const registerWithMail = async (req,res)=>{
    // Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account');
        console.error(err);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // NB! Store the account object values somewhere if you want
    // to re-use the same account for future mail deliveries

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(
        {
            host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass  // generated ethereal password
            },
        }
    );

    // Message object
    let message = {
        from: "examples@example.com",
        to: "test@example.com",
        subject: "test@example.com",
        text: "Hello world",
        html: "<b>hello world</b>"
    };

    transporter.sendMail(message).then(
        (info)=> {return res.status(201).json({
        msg: 'Message sent successfully!', 
        info: info.messageId, 
        preview: nodemailer.getTestMessageUrl(info)})}
        );
});
}

export const registerEmail = async (req,res) => {
    const {email} = req.body
   const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  let config =  {
    service: 'gmail',
    auth: {
    type: "OAuth2",
    user: 'leeondev1000@gmail.com',
    pass: process.env.PASS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: ACCESS_TOKEN,
    }
}

    let transporter = nodemailer.createTransport(config)

    let message = {
        from: process.env.USER,
        to: email,
        subject: "Registered successfully",
        text: "You have registered your account successfully",
        html: "<b>You have registered your account successfully</b>"
    };

    transporter.sendMail(message).then(
        (info)=> {return res.status(201).json({
        msg: 'Message sent successfully!', 
        info: info.messageId, 
        preview: nodemailer.getTestMessageUrl(info)})}
        );
}

export const login = async (req, res)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.status(404).send("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send("username or password is invalid")

        const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_KEY)

    const {password, ...other} = user._doc
    res.cookie("accessToken", token, {httpOnly: true}).status(200).send(other)
    } catch (error) {
        res.status(500).send(error)
    }
}

export const logout = async (req,res, next) => {
 try {
    res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
    }).status(200).send("User logged out")
 } catch (error) {
    res.status(500).send(error)
 }
}


export const forgotPass = async (req, res, next) => {
    const {email} = req.body
    try {
    const user = await User.findOne({email})
    if (!user){return res.send("User does not exist")}
    const secret = process.env.JWT_KEY + user.password
    const token = jwt.sign({email: user.email, id: user._id}, secret, {expiresIn: "30m"})
    const link = `http://localhost:8000/api/auth/reset-password/${user._id}/${token}`
    const linkFrontend = `http://localhost:3000/reset-password/${user._id}/${token}`
    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
    let config =  {
    service: 'gmail',
    auth: {
    type: "OAuth2",
    user: 'leeondev1000@gmail.com',
    pass: process.env.PASS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: ACCESS_TOKEN,
    }
}

    let transporter = nodemailer.createTransport(config)
  
      var mailOptions = {
        from: 'leeondev1000@gmail.com',
        to: email,
        subject: "Password Reset",
        text: linkFrontend,
      };
  
      transporter.sendMail(mailOptions).then(
        (info)=> {return res.status(201).json({
        msg: 'Password reset email sent', 
        info: info.messageId, 
        preview: nodemailer.getTestMessageUrl(info)})}
        );
    } catch (error) {
        res.status(500).send(error)
    }
}


export const resetPass = async (req, res, next) => {
    const {id, token} = req.params
    const user = await User.findOne({_id: id})
    if (!user){return res.send("User does not exist")}
    const secret = process.env.JWT_KEY + user.password
    try {
      const verify = jwt.verify(token, secret)
      res.status(201).send("Verified")
    } catch (error) {
        res.status(401).send("Not verified")
    }
}

export const setNewPass = async (req, res, next) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.send({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_KEY + user.password;
    try {
      const verify = jwt.verify(token, secret);
      const hashedPassword = await bcrypt.hash(password, 5);
      await User.updateOne({ email:user.email },{ $set: {password: hashedPassword}})
      res.status(201).send("Password has been updated")
    } catch (error) {
        console.log(error)
      res.status(404).send({ status: "Something Went Wrong" });
    }
  }