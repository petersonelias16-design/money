
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or similar identifier
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  hasSeenTutorial?: boolean;
  // Gamification
  xp: number;
  level: number;
  streak: number;
  lastLogDate?: string; // YYYY-MM-DD
  badges: string[]; // Array of Badge IDs
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface Expense {
  id: string;
  userId: string;
  value: number;
  categoryId: string;
  description: string;
  date: string; // ISO Date string YYYY-MM-DD
}

export interface Goal {
  id: string;
  userId: string;
  categoryId: string | 'TOTAL';
  amount: number;
  period: 'monthly' | 'weekly';
}

export interface SmartTip {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info';
}

export interface SocialBubble {
  id: string;
  name: string;
  avatarUrl: string;
  text: string;
  timestampRelative: string;
}
