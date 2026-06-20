import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Dna, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  SearchCode 
} from 'lucide-react';

export default function GenomicProfiles({ 
  theme,
  patients, 
  selectedPatient, 
  setSelectedPatient 
}) {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [dnaStream, setDnaStream] = useState([]);

  // Generate simulated DNA sequence nucleotides
  useEffect(() => {
    if (!selectedPatient) return;
    
    const generateSequence = () => {
      const bases = ['A', 'C', 'G', 'T'];
      const sequence = [];
      const len = 160; // 10x16 grid
      for (let i = 0; i < len; i++) {
        const isMutationPos = (selectedPatient.gene === 'BRCA1' && (i === 42 || i === 85)) ||
                            (selectedPatient.gene === 'APOE' && (i === 60 || i === 122)) ||
                            (selectedPatient.gene === 'EGFR' && (i === 15 || i === 134));
        
        sequence.push({
          base: bases[Math.floor(Math.random() * 4)],
          isMutation: isMutationPos,
          active: Math.random() > 0.3
        });
      }
      return sequence;
    };

    setDnaStream(generateSequence());

    let interval;
    if (selectedPatient.status === 'SEQUENCING') {
      interval = setInterval(() => {
        setDnaStream(prev => 
          prev.map(item => 
            Math.random() > 0.85 
              ? { ...item, base: ['A', 'C', 'G', 'T'][Math.floor(Math.random() * 4)], active: Math.random() > 0.3 } 
              : item
          )
        );
      }, 200);
    }

    return () => clearInterval(interval);
  }, [selectedPatient]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.gene.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || patient.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'MEDIUM':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'LOW':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-[#FFD600]" />;
      case 'SEQUENCING':
        return <Dna className="w-4 h-4 text-[#FFD600] animate-spin" style={{ animationDuration: '4s' }} />;
      default:
        return <Clock className="w-4 h-4 text-zinc-500 animate-pulse" />;
    }
  };

  const getNucleotideStyles = (baseObj) => {
    if (baseObj.isMutation) {
      return 'text-black bg-[#FFD600] border-transparent font-black animate-pulse';
    }
    
    if (!baseObj.active) {
      return isDark ? 'text-zinc-800 bg-zinc-950/20 border-zinc-900/60' : 'text-zinc-300 bg-zinc-50/20 border-zinc-100/60';
    }

    // Colored theme settings for dark/light themes
    if (isDark) {
      switch (baseObj.base) {
        case 'A': return 'text-cyan-400 bg-cyan-950/25 border-cyan-900/40';
        case 'T': return 'text-purple-400 bg-purple-950/25 border-purple-900/40';
        case 'C': return 'text-emerald-400 bg-emerald-950/25 border-emerald-900/40';
        default: return 'text-rose-400 bg-rose-950/25 border-rose-900/40';
      }
    } else {
      switch (baseObj.base) {
        case 'A': return 'text-cyan-600 bg-cyan-50 border-cyan-100';
        case 'T': return 'text-purple-600 bg-purple-50 border-purple-100';
        case 'C': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        default: return 'text-rose-600 bg-rose-50 border-rose-100';
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Page Header */}
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          GENOMIC PROFILES & PATIENT DATA
        </h2>
        <p className="text-zinc-500 text-xs mt-1">
          Deep-dive analysis of patient health history combined with molecular-level genetic visualizers.
        </p>
      </div>

      {/* Main Grid split: List & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Patient Table Panel (Left) */}
        <div className={`lg:col-span-5 rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-sm'
        }`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className={`text-xs font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                PATIENT INDEX
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                {filteredPatients.length} profiles
              </span>
            </div>

            {/* Search and Filters - Pill styles */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  id="patient-search-input"
                  placeholder="Search ID, Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full border text-xs rounded-full pl-10 pr-4 py-2 text-zinc-150 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all ${
                    isDark 
                      ? 'bg-zinc-950/60 border-zinc-800 text-white' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>
              <div className="relative">
                <select
                  id="patient-risk-filter"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className={`border text-xs rounded-full pl-4 pr-8 py-2 font-mono focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer transition-all ${
                    isDark 
                      ? 'bg-zinc-950/60 border-zinc-800 text-white' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                >
                  <option value="ALL">ALL RISK</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
                <Filter className="absolute right-3.5 top-3 w-3 h-3 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Patients List - Rounded-2xl items */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredPatients.map((patient) => {
                const isSelected = selectedPatient?.id === patient.id;
                return (
                  <button
                    key={patient.id}
                    id={`patient-btn-${patient.id}`}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs font-mono transition-all duration-150 flex items-center justify-between ${
                      isSelected 
                        ? 'bg-[#FFD600] border-transparent text-black font-bold' 
                        : isDark
                          ? 'bg-zinc-950/40 border-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-800' 
                          : 'bg-zinc-50/50 border-zinc-200/50 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isSelected ? 'text-black' : isDark ? 'text-white' : 'text-zinc-900'}`}>
                          {patient.id}
                        </span>
                        <span className={isSelected ? 'text-black/30' : 'text-zinc-600'}>|</span>
                        <span>{patient.name}</span>
                      </div>
                      <div className="flex gap-2 items-center text-[10px]">
                        <span>Gene: <strong className={isSelected ? 'text-black' : isDark ? 'text-white' : 'text-zinc-800'}>{patient.gene}</strong></span>
                        <span className={isSelected ? 'text-black/30' : 'text-zinc-500'}>•</span>
                        <span>Age: {patient.age}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        isSelected 
                          ? 'text-black border-black/20 bg-black/5' 
                          : getRiskBadge(patient.risk)
                      }`}>
                        {patient.risk}
                      </span>
                      {isSelected ? <CheckCircle2 className="w-4 h-4 text-black" /> : getStatusIcon(patient.status)}
                    </div>
                  </button>
                );
              })}

              {filteredPatients.length === 0 && (
                <div className={`text-center py-12 border border-dashed rounded-2xl ${
                  isDark ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-400'
                }`}>
                  <SearchCode className="w-7 h-7 mx-auto mb-2 text-zinc-500" />
                  <p className="text-xs font-mono">No clinical profiles match filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Genomic Visualizer Panel (Right) */}
        <div className={`lg:col-span-7 rounded-3xl border p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-sm'
        }`}>
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Visualizer Header */}
              <div className={`flex justify-between items-start border-b pb-4 ${
                isDark ? 'border-zinc-800/60' : 'border-zinc-200/60'
              }`}>
                <div>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">
                    Advanced Genome Scanner
                  </span>
                  <h3 className={`text-sm font-bold font-mono mt-0.5 flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    <Dna className="w-4 h-4 text-[#FFD600]" />
                    DNA SEQUENCE VISUALIZER: {selectedPatient.id}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 font-mono block">Status</span>
                  <span className="text-xs font-mono font-bold text-[#FFD600] uppercase">
                    {selectedPatient.status}
                  </span>
                </div>
              </div>

              {/* Patient Case Overview - Rounded-2xl container */}
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-2xl border text-xs font-mono ${
                isDark ? 'bg-zinc-950/40 border-zinc-900' : 'bg-zinc-50/50 border-zinc-200/60'
              }`}>
                <div>
                  <span className="text-zinc-500 uppercase text-[8px] block">Patient Name</span>
                  <span className={`font-semibold text-sm ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{selectedPatient.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase text-[8px] block">Primary Risk Gene</span>
                  <span className="text-amber-500 dark:text-[#FFD600] font-bold text-sm">{selectedPatient.gene} Variant</span>
                </div>
                <div className={`col-span-2 pt-2 border-t ${
                  isDark ? 'border-zinc-900/60' : 'border-zinc-200/60'
                }`}>
                  <span className="text-zinc-500 uppercase text-[8px] block">Clinical History</span>
                  <span className={`text-[11px] leading-relaxed block mt-0.5 ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {selectedPatient.history}
                  </span>
                </div>
              </div>

              {/* Genomic Sequence Mapping */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                    DNA Sequence Grid Mapping
                  </span>
                  <div className="flex items-center gap-4 text-[8px] font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded bg-[#FFD600]" />
                      Mutation Marker
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <span className="w-1.5 h-1.5 rounded bg-zinc-500/20" />
                      Intact Base
                    </span>
                  </div>
                </div>

                <div className={`border rounded-2xl p-4 font-mono scanner-overlay select-none ${
                  isDark ? 'bg-zinc-950/60 border-zinc-900' : 'bg-zinc-50/20 border-zinc-200'
                }`}>
                  <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1 text-[10px] font-extrabold text-center">
                    {dnaStream.map((baseObj, idx) => {
                      const baseClass = getNucleotideStyles(baseObj);
                      return (
                        <div 
                          key={idx}
                          title={baseObj.isMutation ? `Mutation detected at nucleotide ${idx + 24810}` : `Nucleotide base ${baseObj.base}`}
                          className={`aspect-square flex items-center justify-center rounded-lg border transition-all duration-300 font-bold ${baseClass}`}
                        >
                          {baseObj.base}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Warnings and alerts */}
              {selectedPatient.risk === 'HIGH' && (
                <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-500 text-[11px] font-mono leading-relaxed">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold block uppercase text-[9px] tracking-wider mb-0.5">Alert: High Mutation Penetrance</span>
                    Significant cancer susceptibility detected in genetic locus ({selectedPatient.gene}). Prioritize therapeutic predicting sequencing alignment.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center py-20 text-zinc-500">
              <Dna className="w-10 h-10 text-zinc-600 mb-2 animate-pulse" />
              <p className="text-xs font-mono">Select a patient profile to begin DNA sequencing analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
