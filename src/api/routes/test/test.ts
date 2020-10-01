
import { Router } from "express";

export default Router().get("/test", (req, res) => {
	res.json({test: "success"});
});