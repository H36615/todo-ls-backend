import { Router } from "express";
import { getAllTodoItems, addTodoItem } from "../../../controllers/todo-item/todo-item";

const router = Router();

router.get("/todo-item/all", (req, res, next) => {
	getAllTodoItems(req, res, next);
});

router.post("/todo-item/add", (req, res, next) => {
	addTodoItem(req, res, next);
});

export default router;