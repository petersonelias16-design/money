import React, { useEffect, useState } from 'react';
import { User, Expense, Category, SmartTip, Goal } from '../types';
import { BADGES } from '../constants';
import { mockBackend } from '../services/mockBackend';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Lightbulb, Flame, Trophy, Star, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { TutorialOverlay } from '../components/TutorialOverlay';

interface Props {
  user: User;
}

export const Dashboard: React.FC<Props> = ({ user }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tips, setTips] = useState<SmartTip[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month');
  const [showTutorial, setShowTutorial] = useState(false);
  
  // We use a local user state for UI updates to ensure we have the freshest data (like XP/Tutorial status)
  const [localUser, setLocalUser] = useState<User>(user);

  useEffect(() => {
    const loadData = async () => {
      // Fetch fresh user data from Supabase
      const freshUser = await mockBackend.getCurrentUser();
      
      if (freshUser) {
          setLocalUser(freshUser);
          
          const [exp, cats, userGoals, generatedTips] = await Promise.all([
              mockBackend.getExpenses(freshUser.id),
              mockBackend.getCategories(freshUser.id),
              mockBackend.getGoals(freshUser.id),
              mockBackend.getSmartTips(freshUser.id)
          ]);
          
          setExpenses(exp);
          setCategories(cats);
          setGoals(userGoals);
          setTips(generatedTips);
          
          // Check tutorial status
          if (freshUser.hasSeenTutorial === false) {
            setShowTutorial(true);
          }
      }
    };
    loadData();
  }, [user.id]); 

  const handleTutorialComplete = async () => {
    await mockBackend.markTutorialSeen(user.id);
    setShowTutorial(false);
    setLocalUser(prev => ({ ...prev, hasSeenTutorial: true }));
  };

  // Filter logic
  const now = new Date();
  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    if (timeframe === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return d >= oneWeekAgo;
    }
  });

  const total = filteredExpenses.reduce((acc, curr) => acc + curr.value, 0);

  // Budget Logic
  const totalBudget = goals
    .filter(g => g.period === (timeframe === 'month' ? 'monthly' : 'weekly'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const budgetDiff = totalBudget - total;
  const hasBudget = totalBudget > 0;
  const isOverBudget = hasBudget && budgetDiff < 0;

  // Chart Data
  const chartData = categories.map(cat => {
    const val = filteredExpenses.filter(e => e.categoryId === cat.id).reduce((acc, c) => acc + c.value, 0);
    return { name: cat.name, value: val, color: cat.color };
  }).filter(d => d.value > 0);

  // Gamification calculations
  const nextLevelXp = localUser.level * 500;
  const xpProgress = (localUser.xp / nextLevelXp) * 100;
  const userBadges = BADGES.filter(b => localUser.badges?.includes(b.id));

  return (
    <>
      {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}
      
      <div className="p-6 space-y-8 animate-fade-in pb-24">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-dark-muted text-sm">Visão Geral</p>
            <h1 className="text-2xl font-bold text-white">Olá, {localUser.name ? localUser.name.split(' ')[0] : 'Visitante'}</h1>
          </div>
          <div className="flex items-center gap-3">
               {/* Streak Indicator */}
              <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-lg border border-orange-500/30">
                  <Flame size={16} className="text-orange-500 fill-orange-500" />
                  <span className="text-orange-400 font-bold text-sm">{localUser.streak || 0}</span>
              </div>
               <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-500 font-bold border border-primary-500/30">
                  {localUser.name ? localUser.name[0] : 'U'}
              </div>
          </div>
        </div>

        {/* Gamification Bar */}
        <div className="bg-dark-card border border-white/5 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                       <Trophy size={16} className="text-yellow-500" />
                  </div>
                  <div>
                      <span className="text-xs text-dark-muted uppercase font-bold">Nível {localUser.level}</span>
                  </div>
              </div>
              <span className="text-xs text-white font-mono">{localUser.xp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                  className="bg-gradient-to-r from-primary-600 to-primary-400 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${xpProgress}%` }}
              ></div>
          </div>
        </div>

        {/* BUDGET ALERT */}
        {hasBudget ? (
          <div className={`p-5 rounded-2xl border flex items-start gap-4 shadow-lg animate-slide-in ${isOverBudget ? 'bg-red-950/40 border-red-500/50 shadow-red-900/10' : 'bg-emerald-950/40 border-emerald-500/50 shadow-emerald-900/10'}`}>
              <div className={`p-3 rounded-full shrink-0 ${isOverBudget ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                  {isOverBudget ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
              </div>
              <div>
                  <h3 className={`text-lg font-bold leading-tight ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isOverBudget ? 'Atenção: Saldo Negativo!' : 'Parabéns: Saldo Positivo!'}
                  </h3>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                      {isOverBudget 
                          ? <span>Você ultrapassou sua meta em <strong className="text-red-400">R$ {Math.abs(budgetDiff).toFixed(2)}</strong>. Revise seus gastos recentes.</span>
                          : <span>Você ainda tem <strong className="text-emerald-400">R$ {budgetDiff.toFixed(2)}</strong> disponíveis no orçamento planejado.</span>
                      }
                  </p>
              </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-dashed border-slate-600 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-slate-700 p-2 rounded-full">
                  <Target className="text-slate-400" size={20}/>
              </div>
              <div className="flex-1">
                  <p className="text-slate-300 text-sm font-medium">Defina suas Metas</p>
                  <p className="text-slate-500 text-xs">Adicione limites de gasto para ativar os alertas de saldo.</p>
              </div>
          </div>
        )}

        {/* Total Card */}
        <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-900/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wallet size={20} />
              </div>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="bg-black/20 border-none text-xs rounded-lg px-2 py-1 focus:outline-none text-white font-medium"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
              </select>
            </div>
            <p className="text-primary-100 text-sm mb-1">Total Gasto</p>
            <h2 className="text-4xl font-bold tracking-tight">R$ {total.toFixed(2)}</h2>
            {hasBudget && (
                <div className="mt-2 flex items-center gap-2 text-xs text-primary-200">
                    <Target size={12} />
                    <span>Meta: R$ {totalBudget.toFixed(2)}</span>
                </div>
            )}
          </div>
        </div>

        {/* Achievements / Badges */}
        {userBadges.length > 0 && (
          <div>
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" /> Conquistas
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {userBadges.map(badge => (
                      <div key={badge.id} className="bg-dark-card border border-white/5 p-3 rounded-xl min-w-[120px] flex flex-col items-center text-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${badge.color}20` }}>
                               <Trophy size={20} style={{ color: badge.color }} />
                          </div>
                          <span className="text-xs font-bold text-white">{badge.name}</span>
                          <span className="text-[10px] text-dark-muted mt-1 leading-tight">{badge.description}</span>
                      </div>
                  ))}
              </div>
          </div>
        )}

        {/* Smart Tips */}
        {tips.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <Lightbulb size={20} className="text-yellow-400" /> Insights
            </h3>
            {tips.map(tip => (
              <div key={tip.id} className="bg-dark-card border border-white/5 p-4 rounded-xl flex gap-3 items-start">
                <div className={`w-1 min-h-full rounded-full ${tip.type === 'warning' ? 'bg-red-500' : tip.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div>
                  <h4 className="text-white font-medium text-sm">{tip.title}</h4>
                  <p className="text-dark-muted text-xs mt-1 leading-relaxed">{tip.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart Section */}
        {chartData.length > 0 ? (
          <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Por onde sai o dinheiro</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px', color: '#FFF' }}
                    itemStyle={{ color: '#FFF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-xs text-dark-muted block">Top</span>
                <span className="text-sm font-bold text-white">{chartData.sort((a,b) => b.value - a.value)[0].name}</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {chartData.sort((a,b) => b.value - a.value).slice(0, 4).map(cat => (
                <div key={cat.name} className="flex items-center gap-2 text-xs text-dark-muted">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-white font-medium">{Math.round((cat.value/total)*100)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-dark-muted">
            <p>Sem dados para exibir ainda.</p>
          </div>
        )}
      </div>
    </>
  );
};