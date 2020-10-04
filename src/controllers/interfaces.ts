import { Request, Response } from "express";


export interface IController {
	(req: Request, res: Response): Promise<void>
}