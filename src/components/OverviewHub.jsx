import React from 'react';
import { 
  Users, 
  Dna, 
  Cpu, 
  MapPin, 
  Server 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function OverviewHub({ 
  theme,
  metrics, 
  labs, 
  throughputHistory 
}) {
  const isDark = theme === 'dark';

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const cardData = [
    {
      title: "Total Patients Sequenced",
      value: formatNumber(metrics.totalPatients),
      change: "+12.4% MoM",
      icon: Users,
      desc: "Completed sequences"
    },
    {
      title: "Active Lab Workflows",
      value: metrics.activeWorkflows,
      change: metrics.activeWorkflowsChange || "Normal Load",
      icon: Dna,
      desc: "Live molecular runs"
    },
    {
      title: "AI Pipeline Throughput",
      value: `${metrics.throughput.toFixed(1)} Gb/s`,
      change: metrics.throughputChange || "Steady State",
      icon: Cpu,
      desc: "Giga-base analysis rate"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Page Header */}
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          EXECUTIVE OVERVIEW HUB
        </h2>
        <p className="text-zinc-500 text-xs mt-1">
          Real-time enterprise genomic metrics and global pipeline orchestration details.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
                isDark 
                  ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700' 
                  : 'bg-white border-zinc-200/80 hover:border-zinc-300 shadow-sm'
              }`}
            >
              <div className="mb-2">
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block mb-1">
                  {card.title}
                </span>
                <span className={`text-2xl font-extrabold font-mono tracking-tight block ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                  {card.value}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-[9px] bg-[#FFD600]/10 border border-[#FFD600]/30 text-amber-500 dark:text-[#FFD600] px-2 py-0.5 rounded-full font-mono font-bold">
                  {card.change}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {card.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Chart & Global Labs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Panel */}
        <div className={`rounded-3xl border p-6 lg:col-span-2 flex flex-col justify-between transition-all duration-300 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">
                Analysis Velocity Trend
              </span>
              <h3 className={`text-sm font-bold font-mono mt-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                AI GENOMIC PIPELINE PERFORMANCE
              </h3>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider font-bold">
                Live
              </span>
            </div>
          </div>

          <div className="h-64 w-full select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={throughputHistory} 
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="yellowGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD600" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#FFD600" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? '#222' : '#E5E7EB'} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="time" 
                  stroke={isDark ? '#555' : '#9CA3AF'} 
                  fontSize={9} 
                  fontFamily="monospace"
                  tickLine={false} 
                />
                <YAxis 
                  stroke={isDark ? '#555' : '#9CA3AF'} 
                  fontSize={9} 
                  fontFamily="monospace"
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181B' : '#FFFFFF', 
                    borderColor: isDark ? '#27272A' : '#E4E4E7', 
                    borderRadius: '16px',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    color: isDark ? '#fff' : '#000'
                  }}
                  itemStyle={{ color: '#FFD600' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#FFD600" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#yellowGlow)" 
                  activeDot={{ r: 5, fill: '#FFD600', stroke: isDark ? '#121212' : '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Lab Status */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-zinc-200/80 shadow-sm'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">
                  Distributed Nodes
                </span>
                <h3 className={`text-sm font-bold font-mono mt-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  GLOBAL LAB STATUS
                </h3>
              </div>
              <Server className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="space-y-3">
              {labs.map((lab) => {
                const isOnline = lab.status === 'ONLINE';
                return (
                  <div 
                    key={lab.id} 
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex justify-between items-center ${
                      isDark 
                        ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800' 
                        : 'bg-zinc-50/50 border-zinc-200/50 hover:border-zinc-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-bold font-mono block ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {lab.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">
                        {lab.ping}ms latency | {lab.activeJobs} runs
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold border ${
                      isOnline 
                        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                        : 'text-red-500 bg-red-500/10 border-red-500/20'
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`mt-6 border-t pt-4 text-[9px] text-zinc-500 font-mono flex items-center justify-between ${
            isDark ? 'border-zinc-800/60' : 'border-zinc-200/60'
          }`}>
            <span>CONNECTED: {labs.filter(l => l.status === 'ONLINE').length} / {labs.length}</span>
            <span>NODE_BRIDGE_V2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
