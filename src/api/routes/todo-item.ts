import { Router } from "express";
import dbConfig from "../../config/db-config";
import { todoItemDBModel } from "../../models/todo-item/todo-item";

export default Router().get("/todo-item/all", (req, res) => {
	dbConfig(todoItemDBModel.table).select("*").then(rows => {
		res.send(rows);
	});
});