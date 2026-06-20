import Therapy from '../models/Therapy.js';

// @desc    Get therapies for a specific patient ID
// @route   GET /api/therapeutics/:patientId
// @access  Public
export const getTherapeuticsByPatientId = async (req, res) => {
  try {
    const therapies = await Therapy.find({ patientId: req.params.patientId }).select('-__v');
    
    // Return empty array or results
    res.status(200).json(therapies);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving targeted AI therapies', error: error.message });
  }
};
