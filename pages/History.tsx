
import React, { useEffect, useState } from 'react';
import { User, Expense, Category } from '../types';
import { mockBackend } from '../services/mockBackend';
import { Trash2, Calendar } from 'lucide-react';

interface Props {
  user: User;
}

export const History: React.FC<Props> = ({ user }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const [exp, cats] = await Promise.all([
        mockBackend.getExpenses(user.id),
        mockBackend.getCategories(user.id)
      ]);
      setExpenses(exp);
      setCategories(cats);
    };
    fetchData();
  }, [user.id]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este gasto?')) {
      await mockBackend.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const getCategory = (id: string) => categories.find(c => c.id === id);

  // Group by Date
  const grouped = expenses.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="p-6 min-h-screen pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Histórico</h1>
      
      {expenses.length === 0 ? (
        <div className="text-center text-dark-muted mt-20">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).map(date => (
            <div key={date}>
              <h3 className="text-sm font-bold text-dark-muted mb-3 sticky top-0 bg-dark-bg py-2">
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <div className="space-y-3">
                {grouped[date].map(expense => {
                  const cat = getCategory(expense.categoryId);
                  return (
                    <div key={expense.id} className="bg-dark-card border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}>
                          {cat?.name[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{expense.description || cat?.name}</p>
                          <p className="text-xs text-dark-muted">{cat?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">-R$ {expense.value.toFixed(2)}</p>
                        <button onClick={() => handleDelete(expense.id)} className="text-red-500 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Excluir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
