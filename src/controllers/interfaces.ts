import { NextFunction, Request, Response } from "express";

export interface IController {
	(req: Request, res: Response, next: NextFunction): Promise<void>
}

export const enum ResponseType {
	OK,
	UserCreated,
}

/** default case is 'OK' */
export const getResponseValue = (responseType: ResponseType): { response: string } => {
	switch (responseType) {
	default:
	case ResponseType.OK:
		return { response: "ok"};
	case ResponseType.UserCreated:
		return { response: "user created"};
	}
};