import React, { useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { User } from '../types';
import { Zap, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let user;
      if (isLogin) {
        user = await mockBackend.login(email, password);
      } else {
        if (!name) throw new Error("Nome é obrigatório");
        if (password.length < 6) throw new Error("Senha deve ter no mínimo 6 caracteres");
        user = await mockBackend.register(name, email, password);
      }
      onLogin(user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao autenticar. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/20 mb-6 border border-primary-500/30">
            <Zap className="w-8 h-8 text-primary-500" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Money Booster</h1>
          <p className="text-dark-muted">Gestor Inteligente de Gastos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <div className="space-y-1">
                <label className="text-xs font-medium text-dark-muted uppercase ml-1">Nome</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 text-slate-500" size={16} />
                    <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-input border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Seu nome"
                    />
                </div>
             </div>
          )}
          
          <div className="space-y-1">
             <label className="text-xs font-medium text-dark-muted uppercase ml-1">E-mail</label>
             <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-dark-input border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="seu@email.com"
                />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-medium text-dark-muted uppercase ml-1">Senha</label>
             <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-dark-input border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Mínimo 6 caracteres"
                />
             </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta Grátis')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-dark-muted hover:text-white transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem conta? Fazer login'}
          </button>
        </div>
      </div>
    </div>
  );
};