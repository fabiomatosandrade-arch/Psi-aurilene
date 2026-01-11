
import React, { useState } from 'react';
import { User } from '../types';
import { LOGO_AS_GOLD } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError('Nome de usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 mb-4 rounded-full bg-amber-50/30 flex items-center justify-center border-2 border-amber-100 shadow-inner overflow-hidden p-2">
             <img src={LOGO_AS_GOLD} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black gold-text tracking-tighter text-center">PSI.AURILENE</h1>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.3em] font-bold text-center">Acompanhamento Terapêutico</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nome de Usuário</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-300">
                <i className="fas fa-user text-sm"></i>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-300 text-sm"
                placeholder="Digite seu usuário"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Senha</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-300">
                <i className="fas fa-lock text-sm"></i>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-300 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[10px] font-black uppercase p-4 rounded-xl text-center border border-red-100 animate-pulse">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full gold-gradient text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-amber-200/50 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
          >
            Entrar no Portal
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center space-y-4">
          <p className="text-sm text-slate-500">
            Ainda não tem acesso? <br/>
            <a href="#cadastro" className="font-bold text-amber-600 hover:text-amber-700 transition-colors inline-block mt-2 underline decoration-amber-200 underline-offset-4">
              Crie seu usuário aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
