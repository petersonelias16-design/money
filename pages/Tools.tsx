import React, { useState } from 'react';
import { User } from '../types';
import { Calculator, Scan, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';

export const Tools: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'debt' | 'income'>('scanner');

  return (
    <div className="p-4 min-h-screen pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Ferramentas</h1>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'scanner' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
            <Scan size={16} /> Money Scanner
        </button>
        <button 
            onClick={() => setActiveTab('debt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'debt' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
            <CreditCard size={16} /> Dívidas
        </button>
        <button 
            onClick={() => setActiveTab('income')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'income' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
            <Calculator size={16} /> Renda Extra
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 min-h-[300px]">
        
        {activeTab === 'scanner' && (
            <div className="space-y-6 animate-slide-in">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Scan className="text-emerald-500 w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Diagnóstico Financeiro</h2>
                    <p className="text-slate-400 text-sm mt-2">Preencha os dados para gerar um plano de 4 semanas.</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Renda Líquida Mensal</label>
                        <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white mt-1 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="R$ 0,00" />
                    </div>
                    <div>
                         <label className="text-xs text-slate-400 uppercase font-bold">Custo de Vida (Estimado)</label>
                        <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white mt-1" placeholder="R$ 0,00" />
                    </div>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-2">
                        Gerar Plano
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'debt' && (
            <div className="space-y-6 animate-slide-in">
                 <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                    <div>
                        <h3 className="text-red-400 font-bold text-sm">Modo Guerra</h3>
                        <p className="text-red-200/70 text-xs mt-1">Liste as dívidas da maior taxa de juros para a menor.</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div className="flex gap-2">
                         <input type="text" className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm" placeholder="Nome (ex: Cartão)" />
                         <input type="number" className="w-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm" placeholder="R$" />
                    </div>
                     <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 rounded-lg text-sm border border-dashed border-slate-500">
                        + Adicionar Dívida
                    </button>
                </div>
            </div>
        )}
        
        {activeTab === 'income' && (
             <div className="space-y-6 animate-slide-in">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white">Calculadora de Potencial</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                        <span className="text-slate-500 text-xs">Venda de Itens</span>
                        <div className="text-emerald-400 font-bold text-lg">~R$ 450</div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                        <span className="text-slate-500 text-xs">Freelance (5h/sem)</span>
                        <div className="text-emerald-400 font-bold text-lg">~R$ 800</div>
                    </div>
                </div>
                
                <div className="bg-violet-500/10 rounded-xl p-4">
                    <h3 className="text-violet-300 font-bold text-sm mb-2">Ideia Rápida:</h3>
                    <p className="text-slate-300 text-sm">Você tem roupas que não usa? 5 peças podem virar R$ 200 em brechós online hoje.</p>
                    <button className="mt-3 text-violet-400 text-xs font-bold flex items-center gap-1 hover:underline">
                        Ver como fazer <ArrowRight size={12} />
                    </button>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};