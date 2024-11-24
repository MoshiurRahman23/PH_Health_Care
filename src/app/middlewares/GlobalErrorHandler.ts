import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status";

const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || "Internal Server Error",
        error: error
    })
};
export default globalErrorHandler;