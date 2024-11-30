import prisma from "../../../Shared/prisma";
import *as bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";


const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });
    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password InCorrect")
    }

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    },

        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );


    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret)
    } catch (error) {
        throw new Error("You are not Authorized")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: user.email
        }
    });
    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password InCorrect")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12)

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password Change Successful"
    }
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });


    const resetPasswordToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    )
    console.log(resetPasswordToken);

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPasswordToken}`
    await emailSender(
        userData.email,
        `<div>
            <p>Dear User</p>
            <p>Your Password Reset Link
            <a href=${resetPassLink}>
            <button>
                Reset Password
            </button>
            </a>
            </p>
        </div>`
    )
    // console.log(resetPassLink);
};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {
    console.log(token, payload);

    const userData = prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });
    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret);
    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden Access")
    }
    //hash Password

    const password = await bcrypt.hash(payload.password, 12);

    //Update Password into DB

    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
}


export const AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}