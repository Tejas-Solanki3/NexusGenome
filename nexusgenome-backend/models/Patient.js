import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  gene: {
    type: String,
    required: true,
    index: true
  },
  risk: {
    type: String,
    required: true,
    enum: ['HIGH', 'MEDIUM', 'LOW']
  },
  status: {
    type: String,
    required: true,
    enum: ['COMPLETED', 'SEQUENCING', 'PENDING'],
    default: 'PENDING'
  },
  history: {
    type: String,
    required: true
  },
  dnaSequenceGrid: {
    type: [String],
    required: true
  },
  jurisdiction: {
    type: String,
    default: 'AWS-Mumbai'
  }
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
