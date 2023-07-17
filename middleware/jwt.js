import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next)=>{
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("You are not authenticated")

    jwt.verify(token, process.env.JWT_KEY, async (err, payload)=>{
        if (err) return res.status(401).send("You are not authenticated")
        req.userId = payload.id
        next()
    })
}