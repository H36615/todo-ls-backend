import { Router } from "express";
import { getAllTodoItems } from "../../../controllers/todo-item/todo-item";

export default Router().get("/todo-item/all", (req, res, next) => {
	getAllTodoItems(req, res, next);
});