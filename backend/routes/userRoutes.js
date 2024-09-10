import express from "express";
import { register,login,logout } from "../controllers/userController.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

export default router;