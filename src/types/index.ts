export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  isPinned: boolean;
  isEncrypted: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AppState {
  auth: AuthState;
  currentView: 'landing' | 'auth' | 'dashboard' | 'profile';
  notes: Note[];
  currentNote: Note | null;
  searchQuery: string;
  showAIInsights: boolean;
}