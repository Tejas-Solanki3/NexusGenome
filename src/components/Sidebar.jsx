import React from 'react';
import { 
  Activity, 
  Dna, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ 
  theme,
  activeTab, 
  setActiveTab, 
  systemStatus, 
  podCount, 
  activeRegion 
}) {
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: Activity },
    { id: 'genomic', label: 'Genomic Profiles', icon: Dna },
    { id: 'ai', label: 'AI Therapeutics', icon: Sparkles },
    { id: 'devops', label: 'DevOps & Diagnostics', icon: Terminal },
  ];

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'OPTIMAL':
        return isDark ? 'text-[#FFD600] border-zinc-800' : 'text-zinc-900 border-zinc-200';
      case 'DEGRADED':
        return 'text-orange-500 border-orange-500/20';
      case 'CRITICAL':
      case 'OUTAGE':
        return 'text-red-500 border-red-500/20';
      default:
        return 'text-[#FFD600] border-zinc-800';
    }
  };

  const getStatusBg = () => {
    switch (systemStatus) {
      case 'OPTIMAL':
        return isDark ? 'bg-zinc-900/40' : 'bg-white shadow-sm';
      case 'DEGRADED':
        return 'bg-orange-500/5';
      case 'CRITICAL':
      case 'OUTAGE':
        return 'bg-red-500/5';
      default:
        return isDark ? 'bg-zinc-900/40' : 'bg-white shadow-sm';
    }
  };

  return (
    <aside className={`w-80 h-screen sticky top-0 flex flex-col justify-between p-6 select-none shrink-0 border-r transition-all duration-300 ${
      isDark ? 'bg-[#0E0E10] border-zinc-800/80' : 'bg-[#F9F9FB] border-zinc-200/80'
    }`}>
      <div>
        {/* Brand Logo & Header */}
        <div className="mb-10 mt-2">
          <h1 className={`text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            NEXUSGENOME
          </h1>
          <p className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Enterprise Platform</p>
        </div>

        {/* Global Status Banner */}
        <div className={`p-4 rounded-2xl mb-8 border transition-all duration-300 ${getStatusBg()} ${getStatusColor()}`}>
          <div className="flex items-center gap-2.5 mb-1.5">
            {systemStatus === 'OPTIMAL' ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4 animate-bounce" />
            )}
            <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
              SYSTEM: {systemStatus}
            </span>
          </div>
          
          <div className={`text-[10px] font-mono mt-3 space-y-1.5 pt-3 border-t ${
            isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200/80 text-zinc-500'
          }`}>
            <div className="flex justify-between">
              <span>Region:</span>
              <span className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>{activeRegion}</span>
            </div>
            <div className="flex justify-between">
              <span>Cluster:</span>
              <span className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>mumbai-prod</span>
            </div>
            <div className="flex justify-between">
              <span>Active Pods:</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{podCount} / 24</span>
            </div>
          </div>
        </div>

        {/* Navigation Options - Fully Rounded Pills */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs font-semibold font-mono tracking-wider transition-all duration-150 text-left border ${
                  isActive
                    ? 'bg-[#FFD600] border-transparent text-black font-bold'
                    : `bg-transparent border-transparent ${
                        isDark 
                          ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/60' 
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40'
                      }`
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Meta Details */}
      <div className={`border-t pt-4 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200/80'}`}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFD600] animate-pulse"></div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
            Secure TLS 1.3 Active
          </span>
        </div>
      </div>
    </aside>
  );
}
