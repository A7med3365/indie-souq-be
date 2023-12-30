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
import { publishProjectCtrl } from '../controllers/project/publish';

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
    param('projectId').notEmpty().withMessage('Project ID is required'),
    body('title')
      .optional()
      .notEmpty()
      .withMessage('Project Title is required')
      .isLength({ min: 2, max: 30 })
      .withMessage('Title should be between 2 and 30 characters'),
    body('progress')
      .isEmpty()
      .withMessage('Progress cannot be updated directly'),
  ],
  validateRequest,
  currentUser,
  updateProjectCtrl
);

router.put(
  '/api/projects/:projectId/publish',
  [
    param('projectId').notEmpty().withMessage('Project ID is required'),
    body('isPublished').notEmpty().withMessage('Publish status is required'),
  ],
  validateRequest,
  currentUser,
  publishProjectCtrl
);

export { router as projectRouter };
