import React from 'react';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

const data = [
  { name: 'Sem 1', xp: 400 },
  { name: 'Sem 2', xp: 300 },
  { name: 'Sem 3', xp: 600 },
  { name: 'Atual', xp: 200 },
];

export const Reports: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="p-4 min-h-screen pb-24">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Relatórios</h1>
            <button className="text-slate-400 hover:text-white">
                <Download size={20} />
            </button>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Progresso de XP</h2>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            cursor={{fill: 'transparent'}}
                        />
                        <Bar dataKey="xp" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">Resumo da Semana</h2>
            <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400 text-sm">Missões completadas</span>
                    <span className="text-white font-mono font-bold">3</span>
                </div>
                 <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400 text-sm">Economia estimada</span>
                    <span className="text-emerald-400 font-mono font-bold">R$ 250,00</span>
                </div>
                 <div className="flex justify-between pt-2">
                    <span className="text-slate-400 text-sm">Tempo investido</span>
                    <span className="text-white font-mono font-bold">45 min</span>
                </div>
            </div>
        </div>
    </div>
  );
};