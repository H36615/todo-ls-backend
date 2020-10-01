
import { Router } from "express";

export default Router().get("/health", (req, res) => {
	res.json({status: "up"});
});