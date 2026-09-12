import { Router } from 'express';
import { healthRoutes } from './modules/health/health.routes.js';
import { skillsRoutes } from './modules/skills/skills.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/skills', skillsRoutes);
router.use('/users', usersRoutes);

export const apiRoutes = router;
