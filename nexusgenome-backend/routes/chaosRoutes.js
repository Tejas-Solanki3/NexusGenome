import express from 'express';
import { simulateChaos } from '../controllers/chaosController.js';

const router = express.Router();

router.post('/simulate', simulateChaos);

export default router;
