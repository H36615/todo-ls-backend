import { NextFunction, Request, Response } from "express";

export interface IController {
	(req: Request, res: Response, next: NextFunction): Promise<void> | void
}

export const enum ResponseType {
	OK = "ok",
	UserCreated = "user created",
}