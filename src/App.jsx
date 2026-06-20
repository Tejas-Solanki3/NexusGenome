import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OverviewHub from './components/OverviewHub';
import GenomicProfiles from './components/GenomicProfiles';
import AIPredictor from './components/AIPredictor';
import DevOpsChaos from './components/DevOpsChaos';
import { Sun, Moon } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

// Initial Mock Patients (as absolute fallback)
const initialPatients = [
  {
    id: "NX-1002",
    name: "Aria Thorne",
    age: 42,
    gender: "Female",
    gene: "BRCA1",
    risk: "HIGH",
    status: "COMPLETED",
    history: "Patient presents with a strong maternal history of early-onset breast and ovarian cancers. DNA sequencing revealed a pathogenetic heterozygous mutation (c.5266dupC) in the BRCA1 gene, causing pre-mature termination of BRCA1 protein translation."
  },
  {
    id: "NX-1005",
    name: "Julian Vance",
    age: 68,
    gender: "Male",
    gene: "APOE",
    risk: "HIGH",
    status: "COMPLETED",
    history: "Presents with mild memory impairment and family history of late-onset Alzheimer's disease. Sequencing shows homozygous ε4/ε4 alleles at the APOE locus, indicating a significantly elevated risk of neurodegenerative onset."
  },
  {
    id: "NX-1008",
    name: "Seraphina Lin",
    age: 31,
    gender: "Female",
    gene: "MTHFR",
    risk: "LOW",
    status: "COMPLETED",
    history: "Routine genetic screening for elevated homocysteine levels and fatigue. Revealed homozygous C677T variant of MTHFR, showing mild enzymatic activity reduction. Responding positively to dietary methylfolate adjustments."
  },
  {
    id: "NX-1012",
    name: "Dr. Marcus Vance",
    age: 55,
    gender: "Male",
    gene: "EGFR",
    risk: "MEDIUM",
    status: "COMPLETED",
    history: "Non-smoker presenting with cough. Routine biopsy analysis and screening revealed an activating mutation in exon 21 (L858R) of the EGFR tyrosine kinase domain. Ideal candidate for targeted EGFR inhibitor therapy."
  },
  {
    id: "NX-1015",
    name: "Elena Rostova",
    age: 23,
    gender: "Female",
    gene: "BRCA1",
    risk: "HIGH",
    status: "SEQUENCING",
    history: "Familial cancer risk screening. DNA sequencing is currently underway. Locus alignment is running at the Mumbai facility. Real-time base mapping is currently 64% complete."
  }
];

const initialLabs = [
  { id: 1, name: "Mumbai Hub (Primary)", ping: 12, activeJobs: 4, status: "ONLINE" },
  { id: 2, name: "London Lab", ping: 98, activeJobs: 3, status: "ONLINE" },
  { id: 3, name: "Tokyo Gen Center", ping: 115, activeJobs: 5, status: "ONLINE" },
  { id: 4, name: "Boston Biotech Link", ping: 74, activeJobs: 2, status: "ONLINE" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState('OPTIMAL');
  const [podCount, setPodCount] = useState(12);
  const [activeRegion, setActiveRegion] = useState('AWS-Mumbai');
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  
  // Dashboard metrics
  const [metrics, setMetrics] = useState({
    totalPatients: 245612,
    activeWorkflows: 14,
    activeWorkflowsChange: "Normal Load",
    throughput: 842.4,
    throughputChange: "Steady State"
  });

  const [labs, setLabs] = useState(initialLabs);
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(initialPatients[0]);
  const [therapies, setTherapies] = useState([]);

  // Terminal log stream
  const [terminalLogs, setTerminalLogs] = useState([
    { id: 1, text: "--- NEXUSGENOME CORE SHELL INITIALIZED ---", type: "brand" },
    { id: 2, text: `[${new Date().toISOString()}] [INFO] Connected to Kubernetes Cluster (AWS-Mumbai)`, type: "system" },
    { id: 3, text: `[${new Date().toISOString()}] [INFO] System is OPTIMAL. 4 Global Labs linked.`, type: "green" },
    { id: 4, text: "Type 'help' in the CLI form below for options.", type: "gray" }
  ]);

  // Throughput history for recharts area graph
  const [throughputHistory, setThroughputHistory] = useState([
    { time: "20:10", throughput: 810 },
    { time: "20:15", throughput: 830 },
    { time: "20:20", throughput: 825 },
    { time: "20:25", throughput: 845 },
    { time: "20:30", throughput: 840 },
    { time: "20:35", throughput: 855 },
    { time: "20:40", throughput: 848 },
    { time: "20:45", throughput: 842 }
  ]);

  const addLog = (text, type = "gray") => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      { id: Date.now() + Math.random(), text: `[${timestamp}] ${text}`, type }
    ]);
  };

  const clearLogs = () => {
    setTerminalLogs([
      { id: 1, text: "--- TERMINAL BUFFER CLEARED ---", type: "gray" }
    ]);
  };

  // Helper to clear and stream logs sequentially
  const scheduleLogs = (logsArray) => {
    setTerminalLogs([]);
    logsArray.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => {
          const timestamp = new Date().toLocaleTimeString();
          return [
            ...prev,
            { id: Date.now() + Math.random(), text: `[${timestamp}] ${log.text}`, type: log.type }
          ];
        });
      }, idx * 250);
    });
  };

  // 1. Fetch Patients from Express API (with Auto-Fallback)
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        addLog(`Querying patient profiles: GET /api/patients...`, 'system');
        const res = await fetch(`${API_URL}/patients`);
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        
        const data = await res.json();
        if (data && data.length > 0) {
          setPatients(data);
          setSelectedPatient(data[0]);
          addLog(`Database connection resolved. Loaded ${data.length} profiles.`, 'green');
        } else {
          throw new Error('Database patients list is empty');
        }
      } catch (error) {
        addLog(`GET /api/patients failed: ${error.message}. Gracefully falling back to local client data.`, 'warning');
      }
    };

    fetchPatients();
  }, []);

  // 2. Fetch AI Therapeutics from Express API when patient is selected
  useEffect(() => {
    if (!selectedPatient) return;

    const fetchTherapies = async () => {
      try {
        const res = await fetch(`${API_URL}/therapeutics/${selectedPatient.id}`);
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        
        const data = await res.json();
        setTherapies(data);
      } catch (error) {
        // Fallback to empty array, AIPredictor component handles local calculation
        setTherapies([]);
      }
    };

    fetchTherapies();
  }, [selectedPatient]);

  // Background ticker to fluctuate throughput and logs
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        let baseThroughput = 840;
        let volatility = 15;
        let scaleChange = "Steady State";
        let workflows = prev.activeWorkflows;
        let workflowsChange = prev.activeWorkflowsChange;

        if (systemStatus === 'DEGRADED') {
          baseThroughput = 420;
          volatility = 40;
          scaleChange = "Performance Throttled";
        } else if (systemStatus === 'CRITICAL' || systemStatus === 'OUTAGE') {
          baseThroughput = 0;
          volatility = 0;
          scaleChange = "PIPELINE CRASHED";
        } else if (podCount > 15) { 
          baseThroughput = 3150;
          volatility = 120;
          scaleChange = "HPA AUTOSCALE ACTIVE";
        }

        const delta = (Math.random() - 0.5) * volatility;
        const finalThroughput = Math.max(0, parseFloat((baseThroughput + delta).toFixed(1)));

        return {
          ...prev,
          throughput: finalThroughput,
          throughputChange: scaleChange,
          activeWorkflows: workflows,
          activeWorkflowsChange: workflowsChange
        };
      });

      setThroughputHistory(prev => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newHistory = [...prev.slice(1)];
        newHistory.push({
          time: timeStr,
          throughput: metrics.throughput
        });
        return newHistory;
      });

      if (Math.random() > 0.85 && systemStatus === 'OPTIMAL') {
        const randomPatient = patients[Math.floor(Math.random() * patients.length)];
        addLog(`Completed sequence alignment chunk for patient locus ${randomPatient.id}`, "gray");
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [systemStatus, podCount, metrics.throughput, patients]);

  // Unified controller to request DevOps Chaos POST to API (with timeout / fallback)
  const executeChaosSimulation = async (type, fallbackFunc) => {
    try {
      addLog(`DevOps connection active: POST /api/chaos/simulate [type=${type}]...`, 'system');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout fallback
      
      const res = await fetch(`${API_URL}/chaos/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const data = await res.json();
      
      // Update local states from API output
      setSystemStatus(data.systemStatus);
      setPodCount(data.podCount);
      
      // Stream CLI logs returned by the docker container
      setTerminalLogs([]);
      data.simulationLogs.forEach((logText, idx) => {
        setTimeout(() => {
          setTerminalLogs(prev => {
            const timestamp = new Date().toLocaleTimeString();
            return [
              ...prev,
              { id: Date.now() + Math.random(), text: logText, type: logText.includes('conflict') || logText.includes('Deadlock') ? 'error' : logText.includes('CHAOS') ? 'warning' : 'green' }
            ];
          });
        }, idx * 250);
      });
    } catch (error) {
      addLog(`Chaos POST failed: ${error.message}. Running local container stress simulation fallback.`, 'warning');
      fallbackFunc();
    }
  };

  // Chaos Actions
  const triggerLabOutage = () => {
    executeChaosSimulation('outage', () => {
      setLabs(prev => 
        prev.map(lab => 
          (lab.name.includes("London") || lab.name.includes("Mumbai")) 
            ? { ...lab, status: "OFFLINE", ping: 999, activeJobs: 0 } 
            : lab
        )
      );

      setMetrics(prev => ({
        ...prev,
        activeWorkflows: 7,
        activeWorkflowsChange: "Lab Outage Drop"
      }));

      setSystemStatus("DEGRADED");

      scheduleLogs([
        { text: "[chaos-engine] Injecting network partition event: target_zone=eu-west-1", type: "warning" },
        { text: "[k8s-ingress] Connection to london-lab-bridge-ssl lost! Timeout 15s", type: "error" },
        { text: "[k8s-ingress] Connection to mumbai-hub-bridge-ssl lost! Reset by peer", type: "error" },
        { text: "[vault-env] Suppressed unauthorized DB write attempt during outage event", type: "system" },
        { text: "[chaos-engine] Lab network bridge partitioned. Latency threshold exceeded.", type: "warning" },
        { text: "[k8s-ingress] Re-routing client payloads to active secondary nodes (tokyo-02/boston-01)", type: "system" },
        { text: "[chaos-engine] Outage simulation completed. System status degraded to: DEGRADED", type: "brand" }
      ]);
    });
  };

  const triggerWorkloadSpike = () => {
    executeChaosSimulation('spike', () => {
      setMetrics(prev => ({
        ...prev,
        activeWorkflows: 48,
        activeWorkflowsChange: "TRAFFIC_SPIKE"
      }));

      scheduleLogs([
        { text: "[chaos-engine] Injecting traffic demand spike queue (+350%)...", type: "warning" },
        { text: "[k8s-hpa] Core app CPU utilization reached 88.4% (Threshold: 75%)", type: "warning" },
        { text: "[k8s-hpa] Scaling deployment 'nexusgenome-core-app' replica count 12 -> 24", type: "system" },
        { text: "[k8s-scheduler] Provisioning 12 new worker pod nodes... node-mumbai-04/05/06", type: "system" },
        { text: "[k8s-scheduler] 12 new pod replicas status updated to: RUNNING", type: "green" },
        { text: "[k8s-ingress] Workload queue balanced. Load latency stabilized at 8.2ms", type: "green" },
        { text: "[chaos-engine] Scaling demand successfully satisfied. Active replicas: 24", type: "brand" }
      ]);

      setTimeout(() => {
        setPodCount(24);
      }, 1000);
    });
  };

  const triggerDBCorruption = () => {
    executeChaosSimulation('corrupt', () => {
      setSystemStatus("CRITICAL");

      scheduleLogs([
        { text: "[chaos-engine] Injecting write block sector corruption on DB node 'pg-primary-01'...", type: "warning" },
        { text: "[postgres-primary] Write lock conflict. Deadlock detected on table 'genomic_sequences'", type: "error" },
        { text: "[postgres-primary] Transaction rollback triggered. Sequence gap identified in WAL logs", type: "error" },
        { text: "[patroni-manager] Primary node unhealthy. Triggering automatic cluster failover...", type: "system" },
        { text: "[vault-env] Suppressed unauthorized DB write attempt during corruption event", type: "system" },
        { text: "[patroni-manager] Promoting pg_secondary_01 (Tokyo) to PRIMARY (Read/Write)...", type: "system" },
        { text: "[postgres-cluster] Cluster state re-synced. Failover successful. Node connection: DEGRADED", type: "green" }
      ]);

      setTimeout(() => {
        setSystemStatus("DEGRADED");
      }, 1700);
    });
  };

  const triggerJenkinsFailure = () => {
    // Jenkins trigger runs locally since it simulates deployment triggers
    scheduleLogs([
      { text: "[jenkins-runner] Triggering build #412 for branch release-v2.5.0", type: "warning" },
      { text: "[docker-build] Run docker build -t nexusgenome-core:v2.5.0 . -- SUCCESS", type: "gray" },
      { text: "[k8s-lint] Linting Kubernetes charts and yaml manifests -- SUCCESS", type: "gray" },
      { text: "[cypress-test] Running suite 'AI Therapeutics Matcher' - FAILED", type: "error" },
      { text: "[cypress-test] Test assertion failed: Expected efficacy rate >= 90% but got 42% on Patient NX-1002", type: "error" },
      { text: "[jenkins-runner] Pipeline step integration-tests: FAILED (Build status: RED)", type: "error" },
      { text: "[helm-deploy] Deploy validation failed. Rolling back deployment to v2.4.1...", type: "warning" },
      { text: "[k8s-replicas] Rollback complete. Core cluster returned to stable v2.4.1 instances", type: "green" }
    ]);
  };

  const resetSystem = () => {
    executeChaosSimulation('reset', () => {
      scheduleLogs([
        { text: "[chaos-engine] Clearing all active fault injection vectors...", type: "green" },
        { text: "[k8s-ingress] Clearing network partitions. Re-establishing lab connection bridges...", type: "system" },
        { text: "[k8s-ingress] Reconnected Mumbai Hub and London Lab. Latency normal.", type: "green" },
        { text: "[postgres-cluster] Re-syncing database replicators. Restoring pg-primary-01...", type: "system" },
        { text: "[postgres-cluster] Primary database sync completed successfully.", type: "green" },
        { text: "[k8s-hpa] Traffic stable. Scaling down replica sets from 24 back to 12 replicas...", type: "system" },
        { text: "[k8s-hpa] Autoscale termination success. Active worker pods returned to 12.", type: "green" },
        { text: "[chaos-engine] Recovery sequence complete. System health returned to OPTIMAL.", type: "brand" }
      ]);

      setTimeout(() => {
        setLabs(initialLabs);
        setPodCount(12);
        setSystemStatus("OPTIMAL");
        
        setMetrics({
          totalPatients: 245612,
          activeWorkflows: 14,
          activeWorkflowsChange: "Normal Load",
          throughput: 842.4,
          throughputChange: "Steady State"
        });
      }, 2000);
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewHub 
            theme={theme}
            metrics={metrics} 
            labs={labs} 
            throughputHistory={throughputHistory} 
          />
        );
      case 'genomic':
        return (
          <GenomicProfiles 
            theme={theme}
            patients={patients} 
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
          />
        );
      case 'ai':
        return (
          <AIPredictor 
            theme={theme}
            selectedPatient={selectedPatient} 
            therapies={therapies}
          />
        );
      case 'devops':
        return (
          <DevOpsChaos 
            theme={theme}
            systemStatus={systemStatus}
            podCount={podCount}
            triggerLabOutage={triggerLabOutage}
            triggerWorkloadSpike={triggerWorkloadSpike}
            triggerDBCorruption={triggerDBCorruption}
            triggerJenkinsFailure={triggerJenkinsFailure}
            resetSystem={resetSystem}
            terminalLogs={terminalLogs}
            addLog={addLog}
            clearLogs={clearLogs}
          />
        );
      default:
        return <OverviewHub theme={theme} metrics={metrics} labs={labs} throughputHistory={throughputHistory} />;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-[#09090B] text-zinc-100' : 'bg-[#F4F4F5] text-zinc-900'
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar 
        theme={theme}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        systemStatus={systemStatus}
        podCount={podCount}
        activeRegion={activeRegion}
      />

      {/* Main Panel Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        
        {/* Global Control Header Panel */}
        <header className={`border-b pb-6 mb-8 flex justify-between items-center select-none ${
          isDark ? 'border-zinc-800/80' : 'border-zinc-200/80'
        }`}>
          <div>
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">
              Node Gateway
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD600] animate-ping" />
              <span className="text-sm font-bold tracking-tight">
                PROJECT NEXUSGENOME API STACK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 text-[#FFD600]' 
                  : 'bg-white border-zinc-200 text-zinc-950 shadow-sm'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <div className={`px-4 py-2 border rounded-full font-bold ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700 shadow-sm'
            }`}>
              Region: <span className={isDark ? 'text-white' : 'text-zinc-950'}>{activeRegion}</span>
            </div>
            
            <div className={`px-4 py-2 border rounded-full font-bold ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700 shadow-sm'
            }`}>
              Gateway: <span className={isDark ? 'text-white' : 'text-zinc-950'}>KONG</span>
            </div>
          </div>
        </header>

        {/* Dynamic Render Section */}
        {renderContent()}

      </main>
    </div>
  );
}
