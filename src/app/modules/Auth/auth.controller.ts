import { Request, Response } from "express";
import catchAsync from "../../../Shared/catchAsync";
import { AuthServices } from "./auth.services";
import sendResponse from "../../../Shared/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login Successful",
        data: {
            accessToken: result.accessToken,
            needPasswordToken: result.needPasswordChange
        }
    })
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token generated Successfully",
        data: result
    })
});
const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await AuthServices.changePassword(user, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Change Successful",
        data: result
    })
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check Your Email, Please !",
        data: result
    })
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || " ";
    await AuthServices.resetPassword(token, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Reset",
        data: null
    })
});

export const AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}