import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';
import therapyRoutes from './routes/therapyRoutes.js';
import chaosRoutes from './routes/chaosRoutes.js';

// Models for seeding
import Patient from './models/Patient.js';
import Therapy from './models/Therapy.js';

// Load environment config
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Seeding helper to create DNA sequence arrays containing specific mutation locations
const generateDnaGrid = (gene) => {
  const bases = ['A', 'C', 'G', 'T'];
  const sequence = [];
  const len = 160;
  for (let i = 0; i < len; i++) {
    const isMutationPos = (gene === 'BRCA1' && (i === 42 || i === 85)) ||
                        (gene === 'APOE' && (i === 60 || i === 122)) ||
                        (gene === 'EGFR' && (i === 15 || i === 134));
    
    // In our model schema, dnaSequenceGrid is just an array of character strings.
    // If it's a mutation, we will tag it so the frontend identifies it.
    // We can store it as character codes (A, C, T, G) and have the frontend visually parse it.
    // However, to mirror the frontend sequence perfectly, we can store bases.
    // Let's store simple nucleotide characters, but we can also store special flags 
    // or just let the front-end code highlight based on gene type. To match frontend:
    sequence.push(bases[Math.floor(Math.random() * 4)]);
  }
  return sequence;
};

// Database Auto-Seeding Logic
const seedDatabase = async () => {
  try {
    const patientsCount = await Patient.countDocuments();
    if (patientsCount > 0) {
      console.log('[DB] Patients collection already populated. Skipping auto-seeding.');
      return;
    }

    console.log('[DB] Database is empty. Initializing auto-seeding sequence...');

    // 1. Seed Patients
    const mockPatients = [
      {
        id: "NX-1002",
        name: "Aria Thorne",
        age: 42,
        gender: "Female",
        gene: "BRCA1",
        risk: "HIGH",
        status: "COMPLETED",
        history: "Patient presents with a strong maternal history of early-onset breast and ovarian cancers. DNA sequencing revealed a pathogenetic heterozygous mutation (c.5266dupC) in the BRCA1 gene, causing pre-mature termination of BRCA1 protein translation.",
        dnaSequenceGrid: generateDnaGrid('BRCA1'),
        jurisdiction: "AWS-Mumbai"
      },
      {
        id: "NX-1005",
        name: "Julian Vance",
        age: 68,
        gender: "Male",
        gene: "APOE",
        risk: "HIGH",
        status: "COMPLETED",
        history: "Presents with mild memory impairment and family history of late-onset Alzheimer's disease. Sequencing shows homozygous ε4/ε4 alleles at the APOE locus, indicating a significantly elevated risk of neurodegenerative onset.",
        dnaSequenceGrid: generateDnaGrid('APOE'),
        jurisdiction: "AWS-Mumbai"
      },
      {
        id: "NX-1008",
        name: "Seraphina Lin",
        age: 31,
        gender: "Female",
        gene: "MTHFR",
        risk: "LOW",
        status: "COMPLETED",
        history: "Routine genetic screening for elevated homocysteine levels and fatigue. Revealed homozygous C677T variant of MTHFR, showing mild enzymatic activity reduction. Responding positively to dietary methylfolate adjustments.",
        dnaSequenceGrid: generateDnaGrid('MTHFR'),
        jurisdiction: "AWS-Mumbai"
      },
      {
        id: "NX-1012",
        name: "Dr. Marcus Vance",
        age: 55,
        gender: "Male",
        gene: "EGFR",
        risk: "MEDIUM",
        status: "COMPLETED",
        history: "Non-smoker presenting with cough. Routine biopsy analysis and screening revealed an activating mutation in exon 21 (L858R) of the EGFR tyrosine kinase domain. Ideal candidate for targeted EGFR inhibitor therapy.",
        dnaSequenceGrid: generateDnaGrid('EGFR'),
        jurisdiction: "AWS-Mumbai"
      },
      {
        id: "NX-1015",
        name: "Elena Rostova",
        age: 23,
        gender: "Female",
        gene: "BRCA1",
        risk: "HIGH",
        status: "SEQUENCING",
        history: "Familial cancer risk screening. DNA sequencing is currently underway. Locus alignment is running at the Mumbai facility. Real-time base mapping is currently 64% complete.",
        dnaSequenceGrid: generateDnaGrid('BRCA1'),
        jurisdiction: "AWS-Mumbai"
      }
    ];

    await Patient.insertMany(mockPatients);
    console.log(`\x1b[32m[DB] Successfully seeded ${mockPatients.length} patient profiles.\x1b[0m`);

    // 2. Seed AI Therapeutics
    const mockTherapies = [
      // BRCA1 Recommendations
      {
        patientId: "NX-1002",
        therapyName: "Olaparib (PARP Inhibitor)",
        category: "Targeted Monotherapy",
        adrRisk: "LOW",
        recommendedDosage: "300 mg orally twice daily",
        mechanismAction: "Selectively targets cells deficient in BRCA1-mediated DNA repair pathways.",
        adverseReactionProfile: "Low risk of anemia; monitor hemoglobin counts biweekly.",
        calculatedEfficacy: 92,
        
        name: "Olaparib (PARP Inhibitor)",
        efficacy: 92,
        type: "Targeted Monotherapy",
        dosage: "300 mg orally twice daily",
        adrWarning: "Low risk of anemia; monitor hemoglobin counts biweekly.",
        clinicalNotes: "Selectively targets cells deficient in BRCA1-mediated DNA repair pathways.",
        riskLevel: "LOW"
      },
      {
        patientId: "NX-1002",
        therapyName: "Pembrolizumab (Immunotherapy)",
        category: "PD-1 Monoclonal Antibody",
        adrRisk: "MEDIUM",
        recommendedDosage: "200 mg IV infusion every 3 weeks",
        mechanismAction: "Indicated for tumor profiles exhibiting high mutation burden (TMB-H).",
        adverseReactionProfile: "Risk of immune-mediated pneumonitis or thyroiditis.",
        calculatedEfficacy: 78,
        
        name: "Pembrolizumab (Immunotherapy)",
        efficacy: 78,
        type: "PD-1 Monoclonal Antibody",
        dosage: "200 mg IV infusion every 3 weeks",
        adrWarning: "Risk of immune-mediated pneumonitis or thyroiditis.",
        clinicalNotes: "Indicated for tumor profiles exhibiting high mutation burden (TMB-H).",
        riskLevel: "MEDIUM"
      },
      {
        patientId: "NX-1002",
        therapyName: "Anthracycline Chemotherapy",
        category: "Cytotoxic Regimen",
        adrRisk: "HIGH",
        recommendedDosage: "60 mg/m² IV every 21 days",
        mechanismAction: "Reserve as second-line adjuvant if targeted inhibitor pathways are resisted.",
        adverseReactionProfile: "Severe risk of cardiotoxicity, myelosuppression, and alopecia.",
        calculatedEfficacy: 46,
        
        name: "Anthracycline Chemotherapy",
        efficacy: 46,
        type: "Cytotoxic Regimen",
        dosage: "60 mg/m² IV every 21 days",
        adrWarning: "Severe risk of cardiotoxicity, myelosuppression, and alopecia.",
        clinicalNotes: "Reserve as second-line adjuvant if targeted inhibitor pathways are resisted.",
        riskLevel: "HIGH"
      },

      // Duplicate BRCA1 therapies for patient Elena Rostova (NX-1015)
      {
        patientId: "NX-1015",
        therapyName: "Olaparib (PARP Inhibitor)",
        category: "Targeted Monotherapy",
        adrRisk: "LOW",
        recommendedDosage: "300 mg orally twice daily",
        mechanismAction: "Selectively targets cells deficient in BRCA1-mediated DNA repair pathways.",
        adverseReactionProfile: "Low risk of anemia; monitor hemoglobin counts biweekly.",
        calculatedEfficacy: 92,
        
        name: "Olaparib (PARP Inhibitor)",
        efficacy: 92,
        type: "Targeted Monotherapy",
        dosage: "300 mg orally twice daily",
        adrWarning: "Low risk of anemia; monitor hemoglobin counts biweekly.",
        clinicalNotes: "Selectively targets cells deficient in BRCA1-mediated DNA repair pathways.",
        riskLevel: "LOW"
      },

      // APOE Recommendations
      {
        patientId: "NX-1005",
        therapyName: "Lecanemab (Anti-Amyloid Antibody)",
        category: "Monoclonal Antibody Infusion",
        adrRisk: "HIGH",
        recommendedDosage: "10 mg/kg IV every 2 weeks",
        mechanismAction: "Monitors show reduction in amyloid plaque load in early cognitive decline stages.",
        adverseReactionProfile: "High risk of ARIA-E (amyloid-related imaging abnormalities/edema).",
        calculatedEfficacy: 84,
        
        name: "Lecanemab (Anti-Amyloid Antibody)",
        efficacy: 84,
        type: "Monoclonal Antibody Infusion",
        dosage: "10 mg/kg IV every 2 weeks",
        adrWarning: "High risk of ARIA-E (amyloid-related imaging abnormalities/edema).",
        clinicalNotes: "Monitors show reduction in amyloid plaque load in early cognitive decline stages.",
        riskLevel: "HIGH"
      },
      {
        patientId: "NX-1005",
        therapyName: "Donepezil HCl (Cholinesterase Inhibitor)",
        category: "Neuro-regulator",
        adrRisk: "LOW",
        recommendedDosage: "10 mg orally once daily at bedtime",
        mechanismAction: "Temporary symptomatic relief. Target enzyme is acetylcholinesterase.",
        adverseReactionProfile: "Nausea, gastrointestinal muscle spasms, and bradycardia.",
        calculatedEfficacy: 61,
        
        name: "Donepezil HCl (Cholinesterase Inhibitor)",
        efficacy: 61,
        type: "Neuro-regulator",
        dosage: "10 mg orally once daily at bedtime",
        adrWarning: "Nausea, gastrointestinal muscle spasms, and bradycardia.",
        clinicalNotes: "Temporary symptomatic relief. Target enzyme is acetylcholinesterase.",
        riskLevel: "LOW"
      },

      // MTHFR Recommendations
      {
        patientId: "NX-1008",
        therapyName: "Methylfolate (L-5-MTHF)",
        category: "Bioactive Folate Supplementation",
        adrRisk: "LOW",
        recommendedDosage: "15 mg orally once daily",
        mechanismAction: "Bypasses defective methylenetetrahydrofolate reductase pathway enzyme directly.",
        adverseReactionProfile: "Minimal adverse reaction profile. Safest biochemical compensation.",
        calculatedEfficacy: 89,
        
        name: "Methylfolate (L-5-MTHF)",
        efficacy: 89,
        type: "Bioactive Folate Supplementation",
        dosage: "15 mg orally once daily",
        adrWarning: "Minimal adverse reaction profile. Safest biochemical compensation.",
        clinicalNotes: "Bypasses defective methylenetetrahydrofolate reductase pathway enzyme directly.",
        riskLevel: "LOW"
      },

      // EGFR Recommendations
      {
        patientId: "NX-1012",
        therapyName: "Osimertinib (EGFR TKI)",
        category: "Third-Gen Tyrosine Kinase Inhibitor",
        adrRisk: "LOW",
        recommendedDosage: "80 mg orally once daily",
        mechanismAction: "Targets both sensitizing EGFR and resistance T790M genetic mutations.",
        adverseReactionProfile: "QT interval prolongation risk. Monitor electrolytes and ECG.",
        calculatedEfficacy: 95,
        
        name: "Osimertinib (EGFR TKI)",
        efficacy: 95,
        type: "Third-Gen Tyrosine Kinase Inhibitor",
        dosage: "80 mg orally once daily",
        adrWarning: "QT interval prolongation risk. Monitor electrolytes and ECG.",
        clinicalNotes: "Targets both sensitizing EGFR and resistance T790M genetic mutations.",
        riskLevel: "LOW"
      },
      {
        patientId: "NX-1012",
        therapyName: "Gefitinib (First-Gen TKI)",
        category: "Tyrosine Kinase Inhibitor",
        adrRisk: "MEDIUM",
        recommendedDosage: "250 mg orally once daily",
        mechanismAction: "Less effective than Osimertinib in primary EGFR-mutated cases.",
        adverseReactionProfile: "Moderate incidence of diarrhea and elevated liver transaminases.",
        calculatedEfficacy: 58,
        
        name: "Gefitinib (First-Gen TKI)",
        efficacy: 58,
        type: "Tyrosine Kinase Inhibitor",
        dosage: "250 mg orally once daily",
        adrWarning: "Moderate incidence of diarrhea and elevated liver transaminases.",
        clinicalNotes: "Less effective than Osimertinib in primary EGFR-mutated cases.",
        riskLevel: "MEDIUM"
      }
    ];

    await Therapy.insertMany(mockTherapies);
    console.log(`\x1b[32m[DB] Successfully seeded ${mockTherapies.length} AI therapeutic profiles.\x1b[0m`);
    console.log('[DB] Seeding routine completed.');
  } catch (error) {
    console.error(`\x1b[31m[DB] Error during seeding sequence: ${error.message}\x1b[0m`);
  }
};

// Mount Routes
app.use('/api/patients', patientRoutes);
app.use('/api/therapeutics', therapyRoutes);
app.use('/api/chaos', chaosRoutes);

// Root route info endpoint
app.get('/', (req, res) => {
  res.send('Project NexusGenome REST API is active.');
});

// Seed data and start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`[Server] Express API server running on port: ${PORT}`);
  // Run seeding checks
  await seedDatabase();
});
