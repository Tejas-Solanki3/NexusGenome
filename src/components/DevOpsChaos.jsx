import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Trash2, 
  RefreshCw, 
  Server, 
  Cpu, 
  Database, 
  GitBranch, 
  HelpCircle 
} from 'lucide-react';

export default function DevOpsChaos({ 
  theme,
  systemStatus, 
  podCount, 
  triggerLabOutage, 
  triggerWorkloadSpike, 
  triggerDBCorruption, 
  triggerJenkinsFailure, 
  resetSystem,
  terminalLogs,
  addLog,
  clearLogs
}) {
  const isDark = theme === 'dark';
  const [cliInput, setCliInput] = useState('');
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim().toLowerCase();
    addLog(`$ ${cliInput}`, 'input');
    
    setTimeout(() => {
      processCommand(cmd);
    }, 150);

    setCliInput('');
  };

  const processCommand = (cmd) => {
    if (cmd === 'clear') {
      clearLogs();
      return;
    }

    if (cmd === 'help') {
      addLog('Available commands:', 'system');
      addLog('  kubectl get pods        - List active Kubernetes pods and status', 'gray');
      addLog('  kubectl get services    - List active services and ingress endpoints', 'gray');
      addLog('  system status           - Display system resources and node counts', 'gray');
      addLog('  chaos --outage          - Trigger active lab outage simulation', 'gray');
      addLog('  chaos --spike           - Trigger HPA autoscale workload demand', 'gray');
      addLog('  chaos --corrupt         - Trigger simulated DB failover event', 'gray');
      addLog('  chaos --reset           - Reset environment to steady-state optimal', 'gray');
      addLog('  clear                   - Clear terminal buffer logs', 'gray');
      return;
    }

    if (cmd === 'kubectl get pods') {
      addLog('NAME                                    READY   STATUS      RESTARTS   AGE', 'gray');
      const statusText = systemStatus === 'OPTIMAL' ? 'Running' : 
                         systemStatus === 'DEGRADED' ? 'Error' : 'Terminating';
      
      for (let i = 1; i <= podCount; i++) {
        const podName = `nexusgenome-core-pod-${Math.random().toString(36).substring(2, 7)}-${i}`;
        addLog(`${podName.padEnd(40)} 1/1     ${statusText.padEnd(11)} 0          4m22s`, 
          systemStatus === 'OPTIMAL' ? 'green' : 'error'
        );
      }
      return;
    }

    if (cmd === 'kubectl get services' || cmd === 'kubectl get svc') {
      addLog('NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE', 'gray');
      addLog('nexusgenome-core-svc     ClusterIP      10.100.22.42    <none>          80/TCP,443/TCP               18d', 'green');
      addLog('nexusgenome-db-svc       ClusterIP      10.100.45.101   <none>          5432/TCP                     18d', 'green');
      addLog('nexusgenome-ingress      LoadBalancer   10.100.8.14     3.112.98.42     80:31102/TCP,443:31104/TCP   18d', 'brand');
      return;
    }

    if (cmd === 'system status' || cmd === 'system') {
      addLog('--- PROJECT NEXUSGENOME SYSTEM DIAGNOSTICS ---', 'brand');
      addLog(`Global Health Status  : ${systemStatus}`, systemStatus === 'OPTIMAL' ? 'green' : 'error');
      addLog(`Kubernetes Nodes      : 3 Worker, 1 Master Node`, 'gray');
      addLog(`Kubernetes Pods Count : ${podCount} Active (Managed by HPA)`, 'gray');
      addLog(`Active API Gateway    : Kong Ingress Gateway v3.1`, 'gray');
      addLog(`Database Primary State: ${systemStatus === 'DEGRADED' ? 'SECONDARY_ACTIVE (READ_ONLY)' : 'PRIMARY_ACTIVE'}`, 'gray');
      return;
    }

    if (cmd === 'chaos --outage') {
      triggerLabOutage();
      return;
    }

    if (cmd === 'chaos --spike') {
      triggerWorkloadSpike();
      return;
    }

    if (cmd === 'chaos --corrupt') {
      triggerDBCorruption();
      return;
    }

    if (cmd === 'chaos --reset') {
      resetSystem();
      return;
    }

    addLog(`bash: command not found: ${cmd}. Type 'help' for available commands.`, 'error');
  };

  const getLogColorClass = (type) => {
    switch (type) {
      case 'input': return 'text-white font-semibold';
      case 'brand': return 'text-[#FFD600]';
      case 'green': return 'text-emerald-400';
      case 'error': return 'text-red-500 font-bold';
      case 'warning': return 'text-orange-400';
      case 'system': return 'text-cyan-400';
      case 'gray':
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Page Header */}
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          DEVOPS CHAOS & DIAGNOSTICS
        </h2>
        <p className="text-zinc-500 text-xs mt-1">
          Chaos engineering control panel simulating cloud infrastructure disruptions and analyzing resilient state logs.
        </p>
      </div>

      {/* Control Triggers - Sleek Rounded-Full Pill Buttons */}
      <div className="flex flex-wrap gap-3">
        <button 
          id="chaos-btn-outage"
          onClick={triggerLabOutage}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs font-semibold font-mono tracking-wider transition-all duration-150 ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-red-400 hover:border-red-500/50 hover:bg-zinc-900/60' 
              : 'bg-white border-zinc-200 text-red-600 hover:border-red-300 hover:bg-zinc-50 shadow-sm'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Outage Lab</span>
        </button>

        <button 
          id="chaos-btn-spike"
          onClick={triggerWorkloadSpike}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs font-semibold font-mono tracking-wider transition-all duration-150 ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-[#FFD600] hover:border-[#FFD600]/50 hover:bg-zinc-900/60' 
              : 'bg-white border-zinc-200 text-amber-500 hover:border-amber-300 hover:bg-zinc-50 shadow-sm'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Spike Workload</span>
        </button>

        <button 
          id="chaos-btn-corrupt-db"
          onClick={triggerDBCorruption}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs font-semibold font-mono tracking-wider transition-all duration-150 ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-orange-400 hover:border-orange-500/50 hover:bg-zinc-900/60' 
              : 'bg-white border-zinc-200 text-orange-600 hover:border-orange-300 hover:bg-zinc-50 shadow-sm'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Corrupt DB</span>
        </button>

        <button 
          id="chaos-btn-jenkins-fail"
          onClick={triggerJenkinsFailure}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs font-semibold font-mono tracking-wider transition-all duration-150 ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-red-400 hover:border-red-500/50 hover:bg-zinc-900/60' 
              : 'bg-white border-zinc-200 text-red-600 hover:border-red-300 hover:bg-zinc-50 shadow-sm'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Crash Jenkins</span>
        </button>

        <button 
          id="chaos-btn-reset"
          onClick={resetSystem}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs font-semibold font-mono tracking-wider transition-all duration-150 ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-900/60' 
              : 'bg-white border-zinc-200 text-emerald-600 hover:border-emerald-300 hover:bg-zinc-50 shadow-sm'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Reset Health</span>
        </button>
      </div>

      {/* Terminal Window Panel - Obsidian Black for Coding Authenticity */}
      <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        
        {/* Terminal Header */}
        <div className="bg-[#121215]/80 border-b border-zinc-850 px-4 py-3 flex justify-between items-center select-none">
          <div className="flex items-center gap-6">
            {/* macOS buttons */}
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 block" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-[#FFD600]" />
              <span>kubernetes-cluster - sh - 80×24</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button 
              id="terminal-btn-clear"
              onClick={clearLogs}
              title="Clear Terminal Logs"
              className="p-1 rounded-full bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <button 
              id="terminal-btn-help"
              onClick={() => processCommand('help')}
              title="Show Commands Help"
              className="p-1 rounded-full bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Terminal Logs Output Stream */}
        <div className="p-5 h-[340px] overflow-y-auto font-mono text-[11px] space-y-2 select-text">
          {terminalLogs.map((log) => (
            <div 
              key={log.id} 
              className={`leading-relaxed whitespace-pre-wrap ${getLogColorClass(log.type)}`}
            >
              {log.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Interactive CLI Input Form */}
        <form 
          id="terminal-cmd-form"
          onSubmit={handleCommandSubmit}
          className="border-t border-zinc-850 bg-[#0C0C0E] flex items-center px-4 py-3"
        >
          <span className="text-[#FFD600] font-mono text-[11px] font-bold mr-2 select-none">
            nexusgenome-k8s:~$
          </span>
          <input
            type="text"
            id="terminal-cmd-input"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder="Type command (e.g. 'help', 'kubectl get pods')..."
            className="bg-transparent text-white font-mono text-[11px] border-none outline-none flex-1 focus:ring-0 placeholder-zinc-800"
          />
          <button 
            type="submit" 
            id="terminal-cmd-submit-btn"
            className="p-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#FFD600] hover:text-white transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
        </form>
      </div>

    </div>
  );
}
