
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, DailyEntry, Mood } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
    const userEntries = allEntries.filter(e => e.userId === user.id)
      .sort((a, b) => b.timestamp - a.timestamp);
    setEntries(userEntries);
  }, [user.id]);

  const getMoodEmoji = (mood: Mood) => {
    switch (mood) {
      case Mood.VERY_BAD: return '😞';
      case Mood.BAD: return '🙁';
      case Mood.NEUTRAL: return '😐';
      case Mood.GOOD: return '🙂';
      case Mood.EXCELLENT: return '😄';
      default: return '😶';
    }
  };

  const formatLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <Layout 
      title="Minha Jornada" 
      actions={
        <button onClick={onLogout} className="text-slate-400 hover:text-red-500 p-2">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gold-gradient rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Olá, {user.fullName.split(' ')[0]}!</h2>
          <p className="text-amber-50 text-sm opacity-90">Como você está se sentindo hoje?</p>
          <div className="mt-4 flex gap-2">
            <a href="#novo-registro" className="bg-white text-amber-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-transform">
              Registrar Agora
            </a>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-tight">Próxima Sessão</p>
              <p className="text-[10px] text-amber-600">Mantenha sua terapia em dia</p>
            </div>
          </div>
          <a href="#agendamento" className="text-[10px] font-black text-amber-700 uppercase tracking-widest hover:underline">
            Agendar <i className="fas fa-chevron-right ml-1"></i>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Registros</p>
            <p className="text-2xl font-bold text-slate-700">{entries.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Último humor</p>
            <p className="text-2xl font-bold">{entries.length > 0 ? getMoodEmoji(entries[0].mood) : '--'}</p>
          </div>
        </div>

        {/* History List */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Histórico Recente</h3>
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <i className="fas fa-feather-alt text-4xl text-slate-200 mb-3"></i>
                <p className="text-slate-400 text-sm">Você ainda não possui registros.</p>
              </div>
            ) : (
              entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      {formatLocalDate(entry.date)}
                    </span>
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed italic">
                    "{entry.notes}"
                  </p>
                </div>
              ))
            )}
            {entries.length > 5 && (
               <a href="#relatorios" className="block text-center text-xs font-bold text-slate-400 hover:text-amber-600 uppercase py-2">
                 Ver histórico completo
               </a>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
