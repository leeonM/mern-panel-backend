import User from "../models/user.model.js"

export const getUser = async (req,res, next)=>{
        try {
    const user = await User.findById(req.params.id)
    const {password, ...other} = user._doc
    res.status(200).send(other)   
        } catch (error) {
     res.status(500).send(error)   
        }
}