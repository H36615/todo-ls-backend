import { Router } from "express";
import { getAllTodoItems } from "../../../controllers/todo-item/todo-item";

const router = Router();

router.get("/todo-item/all", (req, res, next) => {
	getAllTodoItems(req, res, next);
});

export default router;