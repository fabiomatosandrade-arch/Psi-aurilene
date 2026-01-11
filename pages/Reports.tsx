
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, DailyEntry, Mood } from '../types';
import { generateReportPDF } from '../utils/pdfGenerator';

interface ReportsProps {
  user: User;
}

type FilterPeriod = 'all' | 'week' | 'month' | 'year';

const ITEMS_PER_PAGE = 10;

const Reports: React.FC<ReportsProps> = ({ user }) => {
  const [allUserEntries, setAllUserEntries] = useState<DailyEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DailyEntry[]>([]);
  const [filter, setFilter] = useState<FilterPeriod>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [moodStats, setMoodStats] = useState<{ mood: Mood; count: number; label: string; emoji: string; color: string }[]>([]);
  const [dataAgeWarning, setDataAgeWarning] = useState<string | null>(null);

  useEffect(() => {
    const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
    const userEntries = allEntries.filter(e => e.userId === user.id)
      .sort((a, b) => b.timestamp - a.timestamp);
    setAllUserEntries(userEntries);
  }, [user.id]);

  useEffect(() => {
    const now = Date.now();
    const periods = {
      week: { ms: 7 * 24 * 60 * 60 * 1000, label: 'Semana' },
      month: { ms: 30 * 24 * 60 * 60 * 1000, label: 'Mês' },
      year: { ms: 365 * 24 * 60 * 60 * 1000, label: 'Ano' },
    };

    let filtered = [...allUserEntries];
    setDataAgeWarning(null);

    if (filter !== 'all') {
      const p = periods[filter];
      const threshold = now - p.ms;
      filtered = allUserEntries.filter(e => e.timestamp >= threshold);

      if (allUserEntries.length > 0) {
        const oldestEntry = allUserEntries[allUserEntries.length - 1];
        const historyDurationMs = now - oldestEntry.timestamp;
        
        if (historyDurationMs < p.ms) {
          const daysTotal = Math.ceil(historyDurationMs / (24 * 60 * 60 * 1000)) || 1;
          setDataAgeWarning(`O período de um(a) ${p.label} é maior que seu tempo de uso. Você tem registros de apenas ${daysTotal} dia(s).`);
        }
      }
    }
    
    setFilteredEntries(filtered);
    setVisibleCount(ITEMS_PER_PAGE);

    const stats = [
      { mood: Mood.EXCELLENT, count: 0, label: 'Muito Bem', emoji: '😄', color: 'bg-emerald-500' },
      { mood: Mood.GOOD, count: 0, label: 'Bem', emoji: '🙂', color: 'bg-blue-400' },
      { mood: Mood.NEUTRAL, count: 0, label: 'Neutro', emoji: '😐', color: 'bg-slate-300' },
      { mood: Mood.BAD, count: 0, label: 'Mal', emoji: '🙁', color: 'bg-orange-400' },
      { mood: Mood.VERY_BAD, count: 0, label: 'Muito Mal', emoji: '😞', color: 'bg-red-500' },
    ];

    filtered.forEach(entry => {
      const stat = stats.find(s => s.mood === entry.mood);
      if (stat) stat.count++;
    });

    setMoodStats(stats);
  }, [allUserEntries, filter]);

  const handleDownloadPDF = () => {
    if (filteredEntries.length === 0) {
      alert('Não há registros para gerar relatório neste período.');
      return;
    }
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const doc = generateReportPDF(user, filteredEntries);
        const fileName = `Relatorio_${user.username}_${filter}.pdf`;
        doc.save(fileName);
      } catch (error) {
        alert("Ocorreu um erro ao gerar o PDF.");
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  const filters: { value: FilterPeriod; label: string }[] = [
    { value: 'all', label: 'Tudo' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
    { value: 'year', label: 'Ano' },
  ];

  const paginatedEntries = filteredEntries.slice(0, visibleCount);

  return (
    <Layout title="Relatórios" onBack={() => window.location.hash = '#inicio'}>
      <div className="space-y-6 pb-20">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                filter === f.value ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {dataAgeWarning && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 animate-in fade-in zoom-in">
            <i className="fas fa-info-circle text-amber-500 mt-1"></i>
            <div>
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-tight">Histórico Limitado</p>
              <p className="text-[10px] text-amber-700 leading-tight mt-1">{dataAgeWarning}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating || filteredEntries.length === 0}
          className="w-full gold-gradient text-white flex items-center justify-center gap-3 p-4 rounded-2xl shadow-lg font-bold text-xs tracking-widest disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-pdf"></i>}
          {isGenerating ? 'PROCESSANDO...' : 'EXPORTAR PDF'}
        </button>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Métricas de Humor</h3>
          <div className="space-y-4">
            {moodStats.map((stat) => (
              <div key={stat.mood} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                  <span>{stat.emoji} {stat.label}</span>
                  <span>{stat.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color} transition-all duration-1000`}
                    style={{ width: `${filteredEntries.length > 0 ? (stat.count / Math.max(...moodStats.map(s => s.count), 1)) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {paginatedEntries.map(entry => (
            <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-50 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                <span className="text-lg">{moodStats.find(s => s.mood === entry.mood)?.emoji}</span>
              </div>
              <p className="text-xs text-slate-600 italic line-clamp-2">"{entry.notes}"</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
