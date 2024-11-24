import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidationSchema } from './admin.validation';

const router = express.Router();




router.get('/', AdminController.getAllFromDB);

router.get('/:id', AdminController.getByIdFromDB);

router.patch(
    '/:id',
    validateRequest(AdminValidationSchema.updates),
    AdminController.updateIntoDB
);

router.delete('/:id', AdminController.deleteFromDB);

router.delete('/soft/:id', AdminController.softDeleteFromDB);

export const AdminRoutes = router;
