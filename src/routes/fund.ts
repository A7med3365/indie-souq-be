import express from 'express';
import { createChargeCtrl, getChargeCtrl } from '../controllers/fund/charge';

const router = express.Router();

router.post('/api/charge', createChargeCtrl);
router.get('/api/charge/:chargeId', getChargeCtrl);
export { router as fundRouter };
