import mongoose from 'mongoose';

const therapySchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  // Database Schema specifications:
  therapyName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  adrRisk: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH']
  },
  recommendedDosage: {
    type: String,
    required: true
  },
  mechanismAction: {
    type: String,
    required: true
  },
  adverseReactionProfile: {
    type: String,
    required: true
  },
  calculatedEfficacy: {
    type: Number,
    required: true
  },

  // Direct alignment with frontend mock states:
  name: {
    type: String,
    required: true
  },
  efficacy: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  adrWarning: {
    type: String,
    required: true
  },
  clinicalNotes: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH']
  }
}, {
  timestamps: true
});

const Therapy = mongoose.model('Therapy', therapySchema);
export default Therapy;
