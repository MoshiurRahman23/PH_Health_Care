import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, nest: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body
        })
        return nest();
    } catch (error) {
        nest(error)
    }
}
export default validateRequest;