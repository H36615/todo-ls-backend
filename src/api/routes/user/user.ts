import { Router } from "express";
import { registerUser } from "../../../controllers/user/user";

const router = Router();

router.post("/user/register", (req, res, next) => {
	registerUser(req, res, next);
});

export default router;