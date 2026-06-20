import React from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  FileText,
  Dna
} from 'lucide-react';

export default function AIPredictor({ theme, selectedPatient, therapies }) {
  const isDark = theme === 'dark';

  // Mock therapy recommendation database keyed by gene mutation
  const getTherapyData = (gene) => {
    switch (gene) {
      case 'BRCA1':
        return [
          {
            name: "Olaparib (PARP Inhibitor)",
            efficacy: 92,
            type: "Targeted Monotherapy",
            dosage: "300 mg orally twice daily",
            adrWarning: "Low risk of anemia; monitor hemoglobin counts biweekly.",
            clinicalNotes: "Selectively targets cells deficient in BRCA1-mediated DNA repair pathways.",
            riskLevel: "LOW"
          },
          {
            name: "Pembrolizumab (Immunotherapy)",
            efficacy: 78,
            type: "PD-1 Monoclonal Antibody",
            dosage: "200 mg IV infusion every 3 weeks",
            adrWarning: "Risk of immune-mediated pneumonitis or thyroiditis.",
            clinicalNotes: "Indicated for tumor profiles exhibiting high mutation burden (TMB-H).",
            riskLevel: "MEDIUM"
          },
          {
            name: "Anthracycline Chemotherapy",
            efficacy: 46,
            type: "Cytotoxic Regimen",
            dosage: "60 mg/m² IV every 21 days",
            adrWarning: "Severe risk of cardiotoxicity, myelosuppression, and alopecia.",
            clinicalNotes: "Reserve as second-line adjuvant if targeted inhibitor pathways are resisted.",
            riskLevel: "HIGH"
          }
        ];
      case 'APOE':
        return [
          {
            name: "Lecanemab (Anti-Amyloid Antibody)",
            efficacy: 84,
            type: "Monoclonal Antibody Infusion",
            dosage: "10 mg/kg IV every 2 weeks",
            adrWarning: "High risk of ARIA-E (amyloid-related imaging abnormalities/edema).",
            clinicalNotes: "Monitors show reduction in amyloid plaque load in early cognitive decline stages.",
            riskLevel: "HIGH"
          },
          {
            name: "Donepezil HCl (Cholinesterase Inhibitor)",
            efficacy: 61,
            type: "Neuro-regulator",
            dosage: "10 mg orally once daily at bedtime",
            adrWarning: "Nausea, gastrointestinal muscle spasms, and bradycardia.",
            clinicalNotes: "Temporary symptomatic relief. Target enzyme is acetylcholinesterase.",
            riskLevel: "LOW"
          }
        ];
      case 'EGFR':
        return [
          {
            name: "Osimertinib (EGFR TKI)",
            efficacy: 95,
            type: "Third-Gen Tyrosine Kinase Inhibitor",
            dosage: "80 mg orally once daily",
            adrWarning: "QT interval prolongation risk. Monitor electrolytes and ECG.",
            clinicalNotes: "Targets both sensitizing EGFR and resistance T790M genetic mutations.",
            riskLevel: "LOW"
          },
          {
            name: "Gefitinib (First-Gen TKI)",
            efficacy: 58,
            type: "Tyrosine Kinase Inhibitor",
            dosage: "250 mg orally once daily",
            adrWarning: "Moderate incidence of diarrhea and elevated liver transaminases.",
            clinicalNotes: "Less effective than Osimertinib in primary EGFR-mutated cases.",
            riskLevel: "MEDIUM"
          }
        ];
      case 'MTHFR':
        return [
          {
            name: "Methylfolate (L-5-MTHF)",
            efficacy: 89,
            type: "Bioactive Folate Supplementation",
            dosage: "15 mg orally once daily",
            adrWarning: "Minimal adverse reaction profile. Safest biochemical compensation.",
            clinicalNotes: "Bypasses defective methylenetetrahydrofolate reductase pathway enzyme directly.",
            riskLevel: "LOW"
          }
        ];
      default:
        return [
          {
            name: "Standard Broad-Spectrum Multi-Vitamin",
            efficacy: 30,
            type: "Supportive Nutritional Therapy",
            dosage: "1 tablet daily",
            adrWarning: "No contraindications detected.",
            clinicalNotes: "General supportive care while genome sequence maps are finalizing.",
            riskLevel: "LOW"
          }
        ];
    }
  };

  const therapiesList = (therapies && therapies.length > 0)
    ? therapies
    : (selectedPatient ? getTherapyData(selectedPatient.gene) : []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'MEDIUM':
        return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
      case 'LOW':
        return 'text-green-500 border-green-500/20 bg-green-500/5';
      default:
        return 'text-zinc-400 border-zinc-400/20 bg-zinc-400/5';
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Page Header */}
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          AI THERAPEUTICS PREDICTOR
        </h2>
        <p className="text-zinc-500 text-xs mt-1">
          Precision medicine algorithms calculating therapy efficacy and adverse drug reaction (ADR) risk profiles.
        </p>
      </div>

      {selectedPatient ? (
        <div className="space-y-6">
          {/* Active Profile Status Header - Rounded-2xl container */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
            isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-sm'
          }`}>
            <div>
              <span className="text-[9px] text-zinc-500 font-mono block">Predictive Mode Active</span>
              <h4 className={`text-xs font-bold font-mono mt-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Targeted Genome: {selectedPatient.id} ({selectedPatient.name})
              </h4>
            </div>
            
            <div className="flex items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[8px] uppercase">Locus Variant</span>
                <span className="text-amber-500 dark:text-[#FFD600] font-bold">{selectedPatient.gene} Mutation</span>
              </div>
              <div className={`border-l h-8 pl-6 ${isDark ? 'border-zinc-850' : 'border-zinc-200'}`}>
                <span className="text-zinc-500 block text-[8px] uppercase">Confidence</span>
                <span className={isDark ? 'text-white' : 'text-zinc-900'}>99.4% (DeepBioNet)</span>
              </div>
            </div>
          </div>

          {/* Recommendations Cards List */}
          <div className="grid grid-cols-1 gap-6">
            {therapiesList.map((therapy, index) => {
              const radius = 24;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (therapy.efficacy / 100) * circumference;

              return (
                <div 
                  key={index} 
                  className={`rounded-3xl border p-6 flex flex-col lg:flex-row gap-6 justify-between items-stretch transition-all duration-300 ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-sm'
                  }`}
                >
                  {/* Left Column: Therapy description */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] border font-mono ${
                          isDark ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                        }`}>
                          {therapy.type}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${getRiskColor(therapy.riskLevel)}`}>
                          ADR RISK: {therapy.riskLevel}
                        </span>
                      </div>
                      <h4 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {therapy.name}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-950/40 border-zinc-900/80' : 'bg-zinc-50/50 border-zinc-200/50'}`}>
                        <span className="text-zinc-500 text-[8px] uppercase block mb-1">Recommended Dosage</span>
                        <span className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{therapy.dosage}</span>
                      </div>
                      <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-950/40 border-zinc-900/80' : 'bg-zinc-50/50 border-zinc-200/50'}`}>
                        <span className="text-zinc-500 text-[8px] uppercase block mb-1">Mechanism Action</span>
                        <span className={isDark ? 'text-zinc-350' : 'text-zinc-600'}>{therapy.clinicalNotes}</span>
                      </div>
                    </div>

                    {/* ADR / Safety Warning Panel */}
                    <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      isDark ? 'bg-zinc-950/20 border-zinc-900' : 'bg-zinc-50/30 border-zinc-200/60'
                    }`}>
                      <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${
                        therapy.riskLevel === 'HIGH' ? 'text-red-500 animate-pulse' : 'text-[#FFD600]'
                      }`} />
                      <div className="text-xs font-mono">
                        <span className={`${isDark ? 'text-white' : 'text-zinc-800'} font-bold block text-[9px] uppercase tracking-wider mb-0.5`}>Adverse Reaction Profile</span>
                        <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>{therapy.adrWarning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Efficacy gauge dial */}
                  <div className={`lg:w-44 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-center items-center select-none ${
                    isDark ? 'border-zinc-800/80' : 'border-zinc-200/80'
                  }`}>
                    <div className="relative w-18 h-18 mb-2">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Background track */}
                        <circle
                          cx="36"
                          cy="36"
                          r={radius}
                          className="fill-none stroke-[5]"
                          stroke={isDark ? '#0C0C0E' : '#F4F4F5'}
                        />
                        {/* Foreground value */}
                        <circle
                          cx="36"
                          cy="36"
                          r={radius}
                          className="fill-none stroke-[5] transition-all duration-1000 ease-out"
                          stroke="#FFD600"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Value display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                        <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{therapy.efficacy}%</span>
                      </div>
                    </div>
                    <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider block text-center mb-1">
                      Calculated Efficacy
                    </span>
                    <span className="text-[9px] text-[#FFD600] font-mono font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Optimal Path
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Clinician Signature Section */}
          <div className={`border p-4 rounded-2xl flex items-center justify-between text-xs font-mono ${
            isDark ? 'bg-zinc-950/30 border-zinc-900' : 'bg-white border-zinc-200/80 shadow-sm'
          }`}>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-500">Clinical Recommendation Document (PDF-NX-9)</span>
            </div>
            <button className="text-amber-500 dark:text-[#FFD600] hover:underline uppercase tracking-wider text-[9px] font-bold">
              Download Report
            </button>
          </div>
        </div>
      ) : (
        <div className={`border rounded-3xl py-20 flex flex-col justify-center items-center text-zinc-500 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-sm'
        }`}>
          <Dna className="w-10 h-10 text-zinc-600 mb-2 animate-pulse" />
          <p className="text-xs font-mono">Select a patient profile in Genomic Profiles to review targeted AI therapeutics</p>
        </div>
      )}
    </div>
  );
}
