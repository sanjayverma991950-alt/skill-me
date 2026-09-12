import { Router } from 'express';
import { skillsController } from './skills.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createSkillSchema,
  updateSkillSchema,
  getSkillByIdSchema,
  listSkillsQuerySchema,
} from './skills.schema.js';

const router = Router();

router.get('/', validateRequest({ query: listSkillsQuerySchema }), skillsController.getAll);

router.get('/:id', validateRequest({ params: getSkillByIdSchema }), skillsController.getById);

router.post('/', validateRequest({ body: createSkillSchema }), skillsController.create);

router.patch(
  '/:id',
  validateRequest({ params: getSkillByIdSchema, body: updateSkillSchema }),
  skillsController.update
);

router.delete('/:id', validateRequest({ params: getSkillByIdSchema }), skillsController.delete);

export const skillsRoutes = router;
