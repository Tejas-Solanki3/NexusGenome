import Patient from '../models/Patient.js';

// @desc    Get all patients metadata
// @route   GET /api/patients
// @access  Public
export const getPatients = async (req, res) => {
  try {
    // Select essential fields to keep the list response fast and data-dense
    const patients = await Patient.find({}).select('-__v');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patient index', error: error.message });
  }
};

// @desc    Get single patient by custom ID
// @route   GET /api/patients/:id
// @access  Public
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id }).select('-__v');
    
    if (!patient) {
      return res.status(404).json({ message: `Patient with ID ${req.params.id} not found` });
    }
    
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patient details', error: error.message });
  }
};
