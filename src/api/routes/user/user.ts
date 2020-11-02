import { Router } from "express";
import { passportConfig, passportStrategies } from "../../../config/passport-config";
import { getResponseValue, ResponseType } from "../../../controllers/interfaces";
import { registerUser } from "../../../controllers/user/user";

const router = Router();

router.post("/register", (req, res, next) => {
	registerUser(req, res, next);
});

router.post(
	"/login",
	passportConfig.authenticate(passportStrategies.login, { session: true }),
	(req, res) => {
		res.send(getResponseValue(ResponseType.LoginSuccess));
	}
);

export default router;