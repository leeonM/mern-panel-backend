import express from 'express'
import {login, register, logout, forgotPass, resetPass, setNewPass} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", register)
// router.post("/registerWithMail", registerWithMail)
// router.post("/registerEmail", registerEmail)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forgot-password", forgotPass)
router.get("/reset-password/:id/:token", resetPass)
router.post("/reset-password/:id/:token", setNewPass)

export default router