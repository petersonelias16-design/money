import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { User, UserStatus } from '../types';
import { Shield, Search, Check, X } from 'lucide-react';

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');

  const loadUsers = async () => {
    const all = await mockBackend.getUsers();
    setUsers(all);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleActivation = async (user: User) => {
    if (user.status === UserStatus.PENDING) {
        await mockBackend.adminActivateUser(user.id);
        loadUsers();
    }
  };
  
  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(filter.toLowerCase()) || u.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-4 min-h-screen pb-20">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="text-emerald-500"/> Admin Panel
            </h1>
            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">{users.length} Usuários</span>
        </div>
        
        {/* Simulated Import CSV */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
            <h3 className="text-white font-bold text-sm mb-2">Importar Usuários (CSV)</h3>
            <div className="flex gap-2">
                <div className="flex-1 bg-slate-900 border border-slate-600 border-dashed rounded-lg p-2 text-slate-500 text-xs flex items-center justify-center">
                    Drag & Drop CSV here
                </div>
                <button className="bg-emerald-600 text-white text-xs font-bold px-4 rounded-lg">
                    Upload
                </button>
            </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-slate-500 h-5 w-5" />
            <input 
                type="text" 
                placeholder="Buscar por nome ou e-mail..." 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        {/* List */}
        <div className="space-y-3">
            {filteredUsers.map(user => (
                <div key={user.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold ${user.status === UserStatus.ACTIVE ? 'bg-emerald-900 text-emerald-400' : 'bg-yellow-900 text-yellow-400'}`}>
                            {user.status === UserStatus.ACTIVE ? 'Ativo' : 'Pendente'}
                        </span>
                        {user.status === UserStatus.PENDING && (
                            <button 
                                onClick={() => toggleActivation(user)}
                                className="p-2 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 transition-colors"
                                title="Ativar Manualmente"
                            >
                                <Check size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};