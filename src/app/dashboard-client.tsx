'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: number;
  company_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  industry: string;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  quality_score: number | null;
  status: string;
  message_sent: number;
  responded: number;
  created_at: string;
}

interface Stats {
  total: number;
  new: number;
  researched: number;
  drafted: number;
  sent: number;
  responded: number;
  avgQuality: number;
}

export function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    researched: 0,
    drafted: 0,
    sent: 0,
    responded: 0,
    avgQuality: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.leads || []);
        setStats(data.stats || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800';
      case 'researched': return 'bg-blue-100 text-blue-800';
      case 'drafted': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'responded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-xl">
              🦉
            </div>
            <div>
              <h1 className="text-xl font-semibold">Athena Lead Dashboard</h1>
              <p className="text-sm text-slate-400">More Life Consulting</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard label="Total Leads" value={stats.total} icon="📊" />
          <StatCard label="New" value={stats.new} icon="🆕" />
          <StatCard label="Researched" value={stats.researched} icon="🔍" />
          <StatCard label="Drafted" value={stats.drafted} icon="✍️" />
          <StatCard label="Sent" value={stats.sent} icon="📤" />
          <StatCard label="Responded" value={stats.responded} icon="💬" />
          <StatCard 
            label="Avg Quality" 
            value={stats.avgQuality > 0 ? stats.avgQuality.toFixed(1) : '-'} 
            icon="⭐" 
            highlight={stats.avgQuality >= 7}
          />
        </div>

        {/* Charts & Tables */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Lead Pipeline</h2>
            <div className="space-y-3">
              {[
                { label: 'New', value: stats.new, total: stats.total, color: 'bg-slate-400' },
                { label: 'Researched', value: stats.researched, total: stats.total, color: 'bg-blue-500' },
                { label: 'Drafted', value: stats.drafted, total: stats.total, color: 'bg-amber-500' },
                { label: 'Sent', value: stats.sent, total: stats.total, color: 'bg-emerald-500' },
                { label: 'Responded', value: stats.responded, total: stats.total, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-slate-400">{item.label}</span>
                  <div className="flex-1 h-6 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Response Rate</span>
                <span className="text-xl font-bold text-emerald-400">
                  {stats.sent > 0 ? ((stats.responded / stats.sent) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Draft Rate</span>
                <span className="text-xl font-bold text-amber-400">
                  {stats.total > 0 ? ((stats.drafted / stats.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-400">Quality Avg</span>
                <span className={`text-xl font-bold ${stats.avgQuality >= 7 ? 'text-purple-400' : 'text-slate-400'}`}>
                  {stats.avgQuality > 0 ? stats.avgQuality.toFixed(1) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads Table */}
        <div className="mt-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Leads</h2>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/80 text-slate-400 text-sm">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Company</th>
                  <th className="text-left px-6 py-4 font-medium">Industry</th>
                  <th className="text-left px-6 py-4 font-medium">Location</th>
                  <th className="text-center px-6 py-4 font-medium">Rating</th>
                  <th className="text-center px-6 py-4 font-medium">Quality</th>
                  <th className="text-center px-6 py-4 font-medium">Status</th>
                  <th className="text-left px-6 py-4 font-medium">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No leads yet. Run lead research to populate the database.
                    </td>
                  </tr>
                ) : leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{lead.company_name}</div>
                      <div className="text-sm text-slate-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{lead.industry}</td>
                    <td className="px-6 py-4 text-slate-300">{lead.city}, {lead.state}</td>
                    <td className="px-6 py-4 text-center">
                      {lead.rating ? (
                        <span className="flex items-center justify-center gap-1">
                          ⭐ {lead.rating.toFixed(1)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {lead.quality_score ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          lead.quality_score >= 7 ? 'bg-purple-500/20 text-purple-400' :
                          lead.quality_score >= 4 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-600/20 text-slate-400'
                        }`}>
                          {lead.quality_score}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }: { 
  label: string; 
  value: string | number; 
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border ${
      highlight 
        ? 'bg-purple-500/10 border-purple-500/30' 
        : 'bg-slate-800/50 border-slate-700/50'
    }`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-purple-400' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}
