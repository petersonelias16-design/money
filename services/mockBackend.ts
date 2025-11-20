
import { User, Expense, Category, Goal, SmartTip, UserStatus } from "../types";
import { DEFAULT_CATEGORIES } from "../constants";

const STORAGE_KEYS = {
  USER: 'mb_user',
  EXPENSES: 'mb_expenses',
  GOALS: 'mb_goals',
  CATEGORIES: 'mb_categories'
};

export const mockBackend = {
  // --- AUTH / USER ---
  getCurrentUser: async (): Promise<User> => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      return JSON.parse(stored);
    }

    // Create default visitor user if none exists
    const newUser: User = {
      id: 'local_user',
      name: 'Visitante',
      email: '',
      status: UserStatus.ACTIVE,
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      hasSeenTutorial: false
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email?: string, password?: string): Promise<User> => {
    return mockBackend.getCurrentUser();
  },

  register: async (name: string, email?: string, password?: string): Promise<User> => {
    const user = await mockBackend.getCurrentUser();
    const updated = { ...user, name, email: email || user.email };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  logout: async () => {
    // In local mode, we might just reset data or do nothing
    // localStorage.clear(); 
    // window.location.reload();
  },

  completeOnboarding: async (xpBonus: number): Promise<User> => {
    const user = await mockBackend.getCurrentUser();
    const updated = { ...user, xp: user.xp + xpBonus };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  markTutorialSeen: async (userId: string): Promise<void> => {
    const user = await mockBackend.getCurrentUser();
    const updated = { ...user, hasSeenTutorial: true };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  },

  getUsers: async (): Promise<User[]> => {
    const user = await mockBackend.getCurrentUser();
    return [user];
  },
  
  adminActivateUser: async (userId: string): Promise<void> => {},

  updateUser: async (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // --- EXPENSES ---
  getExpenses: async (userId: string): Promise<Expense[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return stored ? JSON.parse(stored) : [];
  },

  addExpense: async (expenseData: Omit<Expense, 'id'>): Promise<{ expense: Expense, xpGained: number, newBadges: string[] }> => {
    const expenses = await mockBackend.getExpenses(expenseData.userId);
    
    const newExpense: Expense = {
        ...expenseData,
        id: Math.random().toString(36).substr(2, 9)
    };

    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));

    // --- Gamification Logic ---
    const currentUser = await mockBackend.getCurrentUser();
    
    let xpGained = 20; 
    const today = new Date().toISOString().split('T')[0];
    const lastLog = currentUser.lastLogDate;
    let streak = currentUser.streak || 0;

    if (lastLog) {
        const lastDate = new Date(lastLog);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
            streak += 1;
            xpGained += 10; 
        } else if (diffDays > 1) {
            streak = 1; 
        }
    } else {
        streak = 1;
    }

    // Budget Check
    const goals = await mockBackend.getGoals(currentUser.id);
    const categoryGoal = goals.find(g => g.categoryId === expenseData.categoryId && g.period === 'monthly');
    
    if (categoryGoal) {
        const currentTotal = expenses
            .filter(e => e.categoryId === expenseData.categoryId)
            .reduce((acc, curr) => acc + curr.value, 0);
        
        if (currentTotal <= categoryGoal.amount) {
            xpGained += 50; 
        }
    }

    // Update User Stats
    const newXp = (currentUser.xp || 0) + xpGained;
    const newLevel = Math.floor(newXp / 500) + 1;
    
    const existingBadges = currentUser.badges || [];
    const newBadges: string[] = [];

    if (expenses.length === 1 && !existingBadges.includes('first_log')) {
        newBadges.push('first_log');
        existingBadges.push('first_log');
    }
    if (streak >= 3 && !existingBadges.includes('streak_3')) {
        newBadges.push('streak_3');
        existingBadges.push('streak_3');
    }

    const updatedUser = {
        ...currentUser,
        xp: newXp,
        level: newLevel,
        streak: streak,
        lastLogDate: today,
        badges: existingBadges
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    return { expense: newExpense, xpGained, newBadges };
  },

  deleteExpense: async (id: string): Promise<void> => {
    const expenses = await mockBackend.getExpenses('local_user');
    const filtered = expenses.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  },

  // --- CATEGORIES ---
  getCategories: async (userId: string): Promise<Category[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  },

  // --- GOALS ---
  getGoals: async (userId: string): Promise<Goal[]> => {
    const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
    return stored ? JSON.parse(stored) : [];
  },

  setGoal: async (goal: Goal): Promise<Goal> => {
    const goals = await mockBackend.getGoals(goal.userId);
    // Remove existing goal for same category/period
    const filtered = goals.filter(g => !(g.categoryId === goal.categoryId && g.period === goal.period));
    
    const newGoal = { ...goal, id: Math.random().toString(36).substr(2, 9) };
    filtered.push(newGoal);
    
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
    return newGoal;
  },

  // --- INTELLIGENCE ---
  getSmartTips: async (userId: string): Promise<SmartTip[]> => {
    const expenses = await mockBackend.getExpenses(userId);
    const categories = await mockBackend.getCategories(userId);
    
    const tips: SmartTip[] = [];

    if (expenses.length === 0) {
      return [{ id: '1', title: 'Comece agora', message: 'Adicione seu primeiro gasto para receber insights.', type: 'info' }];
    }

    const total = expenses.reduce((acc, curr) => acc + curr.value, 0);
    
    const catTotals: Record<string, number> = {};
    expenses.forEach(e => {
      catTotals[e.categoryId] = (catTotals[e.categoryId] || 0) + e.value;
    });
    
    const topCatId = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b, Object.keys(catTotals)[0]);
    const topCatVal = catTotals[topCatId];
    const topCatName = categories.find(c => c.id === topCatId)?.name || 'Desconhecido';
    const percent = Math.round((topCatVal / total) * 100);

    if (percent > 40) {
      tips.push({
        id: 'warn_1',
        title: 'Alerta de Gasto',
        message: `${topCatName} consumiu ${percent}% do seu dinheiro.`,
        type: 'warning'
      });
    }

    tips.push({
        id: 'info_1',
        title: 'Resumo',
        message: `Você já gastou R$ ${total.toFixed(2)} no total.`,
        type: 'info'
    });

    return tips;
  }
};
