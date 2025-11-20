
import React, { useEffect, useState } from 'react';
import { User, Goal, Category } from '../types';
import { mockBackend } from '../services/mockBackend';
import { User as UserIcon, Target, AlertCircle, Trash2 } from 'lucide-react';

interface Props {
  user: User;
}

export const Settings: React.FC<Props> = ({ user }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editGoal, setEditGoal] = useState<{ catId: string, amount: string } | null>(null);

  useEffect(() => {
    const load = async () => {
        const c = await mockBackend.getCategories(user.id);
        const g = await mockBackend.getGoals(user.id);
        setCategories(c);
        setGoals(g);
    };
    load();
  }, [user.id]);

  const handleSaveGoal = async () => {
    if (!editGoal) return;
    const newGoal: Goal = {
        id: '', // Backend generates ID
        userId: user.id,
        categoryId: editGoal.catId,
        amount: parseFloat(editGoal.amount),
        period: 'monthly'
    };
    await mockBackend.setGoal(newGoal);
    
    // Refresh
    const g = await mockBackend.getGoals(user.id);
    setGoals(g);
    setEditGoal(null);
  };

  const handleReset = () => {
      if (window.confirm("Isso apagará todos os seus dados deste dispositivo. Tem certeza?")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  return (
    <div className="p-6 min-h-screen pb-24">
      <h1 className="text-2xl font-bold text-white mb-8">Configurações</h1>

      {/* Profile Section */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.name ? user.name[0] : 'U'}
        </div>
        <div className="flex-1">
            <h2 className="text-white font-bold">{user.name}</h2>
            <p className="text-dark-muted text-sm">Modo Offline</p>
        </div>
      </div>

      {/* Goals Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="text-primary-500" size={20} /> Metas Mensais
        </h2>
        <div className="space-y-3">
            {categories.map(cat => {
                const goal = goals.find(g => g.categoryId === cat.id);
                const isEditing = editGoal?.catId === cat.id;

                return (
                    <div key={cat.id} className="bg-dark-card border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: cat.color}}></div>
                            <span className="text-white font-medium text-sm">{cat.name}</span>
                        </div>
                        
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    value={editGoal.amount}
                                    onChange={(e) => setEditGoal({...editGoal, amount: e.target.value})}
                                    className="w-20 bg-dark-input border border-white/20 rounded px-2 py-1 text-white text-sm"
                                    autoFocus
                                />
                                <button onClick={handleSaveGoal} className="text-primary-500 font-bold text-xs uppercase">OK</button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setEditGoal({ catId: cat.id, amount: goal?.amount.toString() || '' })}
                                className={`text-sm font-medium ${goal ? 'text-white' : 'text-dark-muted border-b border-dashed border-dark-muted'}`}
                            >
                                {goal ? `R$ ${goal.amount}` : 'Definir'}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
      </div>

       <button 
          onClick={handleReset}
          className="w-full bg-red-500/10 border border-red-500/30 text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors mt-8"
       >
          <Trash2 size={18} /> Resetar Todos os Dados
       </button>

       <div className="text-center mt-8">
            <p className="text-dark-muted text-xs">Money Booster v2.2 (Offline)</p>
       </div>
    </div>
  );
};
