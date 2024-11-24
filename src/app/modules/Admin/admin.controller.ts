import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../Shared/pick';
import { adminFilterAbleFields } from './admin.constant';
import sendResponse from '../../../Shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../Shared/catchAsync';


const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
    const filters = pick(req.query, adminFilterAbleFields)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await AdminService.getAllFromDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created Success",
        meta: result.meta,
        data: result.data
    })
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched By Id",
        data: result
    })
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data Updated",
        data: result
    })
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data Deleted",
        data: result
    })
});
const softDeleteFromDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data Deleted",
        data: result
    })
});

export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}

// function next(error: unknown) {
//     throw new Error('Function not implemented.');
// }
