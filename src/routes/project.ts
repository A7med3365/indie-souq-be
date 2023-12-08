import express from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validate-req';
import {
  listProjectCtrl,
  showProjectCtrl,
  listUserProjectCtrl,
} from '../controllers/project/list';
import { createProjectCtrl } from '../controllers/project/create';
import { updateProjectCtrl } from '../controllers/project/update';
import { currentUser } from '../middleware/logged-in-check';

const router = express.Router();

router.get('/api/projects', listProjectCtrl);
router.get(
  '/api/user-projects/:userId',
  [
    param('userId')
      .notEmpty()
      .isMongoId()
      .withMessage('Creator ID must be valid'),
  ],
  validateRequest,
  listUserProjectCtrl
);
router.get('/api/projects/:projectId', showProjectCtrl);

router.post(
  '/api/projects',
  [
    body('title')
      .notEmpty()
      .withMessage('Project Title is required')
      .isLength({ min: 2, max: 30 })
      .withMessage('Title should be between 2 and 30 characters'),
    body('creator')
      .notEmpty()
      .withMessage('Creator ID is required')
      .isMongoId()
      .withMessage('Creator ID must be valid'),
  ],
  validateRequest,
  createProjectCtrl
);

router.put(
  '/api/projects/:projectId',
  [
    body('title')
      .optional()
      .notEmpty()
      .withMessage('Project Title is required')
      .isLength({ min: 2, max: 30 })
      .withMessage('Title should be between 2 and 30 characters'),
  ],
  validateRequest,
  currentUser,
  updateProjectCtrl
);

export { router as projectRouter };
