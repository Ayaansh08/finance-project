import { Router } from "express";
import rateLimit from "express-rate-limit";

import { login, register } from "../controllers/auth.controller";

const authRouter = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication requests. Please try again later." },
});

authRouter.use(authLimiter);
authRouter.post("/register", register);
authRouter.post("/login", login);

export { authRouter };
