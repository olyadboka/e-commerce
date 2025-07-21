import express from "express";
import logout from "../controllers/logoutController";

const router = express.Router();

router.get("/logout", logout);

export default router;
