
import React, { useState } from 'react';
import { User } from '../types';
import { LOGO_AS_GOLD } from '../constants';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { username, fullName, birthDate, password, confirmPassword } = formData;

    if (!username || !fullName || !birthDate || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError('Este nome de usuário já está em uso.');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      fullName,
      birthDate,
      password
    };

    users.push(newUser);
    localStorage.setItem('psicolog_users', JSON.stringify(users));
    
    alert('Cadastro realizado com sucesso!');
    onRegisterSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
           <img src={LOGO_AS_GOLD} alt="Logo" className="w-20 h-20 mb-2 object-contain" />
           <h2 className="text-xl font-black gold-text uppercase tracking-tight">Novo Paciente</h2>
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">Crie seu usuário de acesso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Nome Completo</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              placeholder="Ex: João da Silva"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Nome de Usuário</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                placeholder="Ex: joao_silva"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Data Nasc.</label>
              <input
                type="date"
                name="birthDate"
                required
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Senha</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                placeholder="******"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Confirmar</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                placeholder="******"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full gold-gradient text-white font-black py-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
          >
            Finalizar Cadastro
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Já tem conta? <a href="#login" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">Fazer Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
