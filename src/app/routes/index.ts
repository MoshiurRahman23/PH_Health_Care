import express from 'express';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UseRoutes } from '../modules/User/user.route';



const router = express.Router();

const modulesRoutes = [
    {
        path: '/user',
        route: UseRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    }
];

modulesRoutes.forEach(route => router.use(route.path, route.route))

export default router;