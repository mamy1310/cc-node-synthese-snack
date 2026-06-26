import { Router } from "express";
import { signupRules, loginRules } from "../validators/auth.js";
import { validate } from "../middlewares/validate.js";
import { signup, login } from "../controllers/user.js";

const router = Router();

router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);

export default router;
