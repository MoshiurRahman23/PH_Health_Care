import prisma from "../../../Shared/prisma";
import *as bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";

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
        "asdfghjkl",
        "5m"
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    },
        "asdfghjklzxcvbnm",
        "5m"
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
        decodedData = jwtHelpers.verifyToken(token, "asdfghjklzxcvbnm")
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
        "asdfghjkl",
        "5m"
    );
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };
};


export const AuthServices = {
    loginUser,
    refreshToken
}