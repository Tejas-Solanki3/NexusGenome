import express from 'express';
import { getTherapeuticsByPatientId } from '../controllers/therapyController.js';

const router = express.Router();

router.get('/:patientId', getTherapeuticsByPatientId);

export default router;
