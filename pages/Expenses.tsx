
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Category } from '../types';
import { mockBackend } from '../services/mockBackend';
import { Check, ChevronLeft, Star } from 'lucide-react';

interface Props {
  user: User;
}

export const Expenses: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFeedback, setShowFeedback] = useState<{ xp: number, badge?: string } | null>(null);

  useEffect(() => {
    mockBackend.getCategories(user.id).then(setCategories);
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;

    const result = await mockBackend.addExpense({
      userId: user.id,
      value: parseFloat(amount),
      description,
      categoryId,
      date,
    });

    // Show Gamification Feedback
    if (result.xpGained > 0) {
        setShowFeedback({ xp: result.xpGained, badge: result.newBadges[0] });
        setTimeout(() => {
            navigate('/');
        }, 1800); // Wait for animation
    } else {
        navigate('/');
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col relative">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-dark-muted hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Adicionar Gasto</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        <div>
          <label className="block text-xs font-bold text-dark-muted uppercase mb-2">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full bg-transparent border-b-2 border-white/20 py-4 text-4xl font-bold text-white focus:outline-none focus:border-primary-500 placeholder-white/10"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-dark-muted uppercase mb-2">Categoria</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`p-3 rounded-xl text-xs font-medium transition-all border ${categoryId === cat.id ? 'bg-primary-600 border-primary-500 text-white' : 'bg-dark-card border-white/5 text-dark-muted hover:bg-white/5'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-dark-muted uppercase mb-2">Detalhes</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Almoço no shopping"
            className="w-full bg-dark-input border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
           <label className="block text-xs font-bold text-dark-muted uppercase mb-2">Data</label>
           <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-dark-input border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
           />
        </div>

        <div className="flex-1"></div>

        <button
          type="submit"
          disabled={!amount || !categoryId}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-900/50 transition-all"
        >
          <Check size={20} /> Salvar Gasto
        </button>
      </form>

      {/* Feedback Overlay */}
      {showFeedback && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="bg-dark-card border border-white/10 p-8 rounded-2xl flex flex-col items-center text-center shadow-2xl transform animate-scale-up">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <Star size={40} className="text-black fill-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Registro Salvo!</h2>
                <p className="text-yellow-400 font-bold text-xl">+{showFeedback.xp} XP</p>
                {showFeedback.badge && (
                    <div className="mt-4 bg-primary-900/50 border border-primary-500/30 px-4 py-2 rounded-lg">
                        <p className="text-xs text-primary-200 uppercase">Nova Conquista</p>
                        <p className="text-white font-bold">🏅 Desbloqueada!</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
