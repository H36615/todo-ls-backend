import { Router } from "express";
import { passportConfig, passportStrategies } from "../../../config/passport-config";
import { registerUser, sessionIsValid, signOut } from "../../../controllers/user/user";

const router = Router();

router.post("/register", (req, res, next) => {
	registerUser(req, res, next);
});

router.post(
	"/login",
	passportConfig.authenticate(passportStrategies.login, { session: true }),
	(req, res) => {
		res.send(req.user);
	}
);

router.get(
	"/valid-session",
	sessionIsValid,
);

router.get(
	"/sign-out",
	signOut,
);


export default router;