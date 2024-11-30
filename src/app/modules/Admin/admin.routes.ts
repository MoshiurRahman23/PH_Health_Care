import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidationSchema } from './admin.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();




router.get('/',
    auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
    AdminController.getAllFromDB
);

router.get('/:id',
    auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
    AdminController.getByIdFromDB
);

router.patch(
    '/:id',
    auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
    validateRequest(AdminValidationSchema.updates),
    AdminController.updateIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
    AdminController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
    AdminController.softDeleteFromDB
);

export const AdminRoutes = router;
