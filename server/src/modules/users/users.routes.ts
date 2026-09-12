import { Router } from 'express';
import { usersController } from './users.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  listUsersQuerySchema,
} from './users.schema.js';

const router = Router();

router.get('/', validateRequest({ query: listUsersQuerySchema }), usersController.getAll);

router.get('/:id', validateRequest({ params: getUserByIdSchema }), usersController.getById);

router.post('/', validateRequest({ body: createUserSchema }), usersController.create);

router.patch(
  '/:id',
  validateRequest({ params: getUserByIdSchema, body: updateUserSchema }),
  usersController.update
);

router.delete('/:id', validateRequest({ params: getUserByIdSchema }), usersController.delete);

export const usersRoutes = router;
