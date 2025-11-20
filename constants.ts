
import { Category, SocialBubble, Badge } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Alimentação', color: '#EF4444', isDefault: true }, // Red
  { id: 'cat_2', name: 'Contas', color: '#F59E0B', isDefault: true },      // Orange
  { id: 'cat_3', name: 'Transporte', color: '#3B82F6', isDefault: true },  // Blue
  { id: 'cat_4', name: 'Lazer', color: '#8B5CF6', isDefault: true },       // Violet
  { id: 'cat_5', name: 'Compras', color: '#EC4899', isDefault: true },     // Pink
  { id: 'cat_6', name: 'Saúde', color: '#10B981', isDefault: true },       // Emerald
  { id: 'cat_7', name: 'Outros', color: '#6B7280', isDefault: true },      // Gray
];

export const BADGES: Badge[] = [
  { id: 'first_log', name: 'Primeiro Passo', description: 'Registrou o primeiro gasto', icon: 'Flag', color: '#3B82F6' },
  { id: 'streak_3', name: 'No Foco', description: '3 dias seguidos de registros', icon: 'Flame', color: '#F59E0B' },
  { id: 'streak_7', name: 'Hábito de Aço', description: '7 dias seguidos de registros', icon: 'Zap', color: '#8B5CF6' },
  { id: 'smart_saver', name: 'Economista', description: 'Manteve o gasto dentro da meta', icon: 'PiggyBank', color: '#10B981' },
  { id: 'xp_master', name: 'Level Up', description: 'Atingiu o nível 5', icon: 'Trophy', color: '#EC4899' },
];

export const MOCK_TIPS = [
  { id: 't1', title: 'Atenção aos gastos', message: 'Alimentação representa 40% do seu orçamento este mês.', type: 'warning' },
  { id: 't2', title: 'Bom trabalho!', message: 'Você gastou 10% a menos que a semana passada.', type: 'success' },
  { id: 't3', title: 'Dica de economia', message: 'Reveja suas assinaturas mensais para encontrar cortes.', type: 'info' },
];

export const SEED_QUIZ_QUESTIONS = [
  { id: 1, text: "Qual seu principal objetivo financeiro?", options: ["Sair das dívidas", "Começar a investir", "Juntar para um sonho", "Controlar gastos"] },
  { id: 2, text: "Como você se sente sobre suas finanças?", options: ["Ansioso", "No controle", "Perdido", "Esperançoso"] },
  { id: 3, text: "Com que frequência você verifica seu saldo?", options: ["Todo dia", "Uma vez por semana", "Só quando preciso", "Tenho medo de olhar"] },
];

export const SEED_SOCIAL_BUBBLES: SocialBubble[] = [
  { id: 'sb1', name: 'Julia M.', avatarUrl: 'https://i.pravatar.cc/150?img=5', text: 'Consegui economizar R$ 300 na primeira semana!', timestampRelative: 'há 2 min' },
  { id: 'sb2', name: 'Roberto S.', avatarUrl: 'https://i.pravatar.cc/150?img=11', text: 'Finalmente entendi para onde vai meu salário.', timestampRelative: 'há 5 min' },
  { id: 'sb3', name: 'Carla D.', avatarUrl: 'https://i.pravatar.cc/150?img=9', text: 'A dica de supermercado funcionou muito.', timestampRelative: 'há 12 min' },
];
