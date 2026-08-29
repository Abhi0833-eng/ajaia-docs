export type UserRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  createdAt?: string;
}

export interface Share {
  id: string;
  documentId: string;
  userId: string;
  user: User;
  role: 'VIEWER' | 'EDITOR';
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  documentId: string;
  title: string;
  content: string;
  savedAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  owner: User;
  shares: Share[];
  histories?: HistoryItem[];
  createdAt: string;
  updatedAt: string;
  isSharedWithMe?: boolean;
  currentUserRole?: UserRole;
}
