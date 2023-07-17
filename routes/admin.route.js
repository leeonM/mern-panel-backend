import express from 'express'
import {login, register, addProduct, updateUser} from "../controllers/admin.controller.js"
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/addProduct", addProduct)
router.put("/updateUser", updateUser)

export default router