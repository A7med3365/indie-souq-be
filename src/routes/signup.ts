import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

import { signupCtrl } from '../controllers/auth/signup';
import { signinCtrl } from '../controllers/auth/signin';
import { signoutCtrl } from '../controllers/auth/signout';
// import { currentUserCtrl } from '../controllers/currentUser';
import { validateRequest } from '../middleware/validate-req';
import { currentUser, isAuth } from '../middleware/logged-in-check';

import { listUsersCtrl } from '../controllers/list/users';

router.post(
  '/api/users/signup',
  [
    body('firstName')
      .notEmpty()
      .withMessage('First name is required')
      .isAlpha()
      .withMessage('First name should only contain alphabetic characters')
      .isLength({ min: 2, max: 30 })
      .withMessage('First name should be between 2 and 30 characters'),
    body('lastName')
      .notEmpty()
      .withMessage('Last name is required')
      .isAlpha()
      .withMessage('Last name should only contain alphabetic characters')
      .isLength({ min: 2, max: 30 })
      .withMessage('Last name should be between 2 and 30 characters'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim() // remove spaces
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('isFilmmaker')
      .isBoolean()
      .withMessage(
        'filmmaker flag must be boolean value, true for filmmaker usertype'
      ),
    body('isAdmin')
      .optional()
      .isBoolean()
      .withMessage('admin flag must be boolean value, true for admin usertype'),
  ],
  validateRequest,
  signupCtrl
);

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  signinCtrl
);

// router.get('/api/users/currentuser', currentUser, currentUserCtrl);

router.get('/api/users/signout', signoutCtrl);

router.get('/api/users', listUsersCtrl);

export { router as authRouter };
