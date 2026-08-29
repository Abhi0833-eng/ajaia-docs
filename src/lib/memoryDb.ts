import { DocumentItem, User } from './types';

// In-Memory Database Fallback for Vercel Serverless Functions
export const SEEDED_USERS: User[] = [
  {
    id: 'usr_alex_01',
    name: 'Alex Rivera',
    email: 'alex@ajaia.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr_sarah_02',
    name: 'Sarah Chen',
    email: 'sarah@ajaia.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'usr_devin_03',
    name: 'Devin Miller',
    email: 'devin@ajaia.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_product_roadmap',
    title: 'Ajaia Product Roadmap & Q3 Objectives',
    content: `
      <h1>Ajaia Product Roadmap & Q3 Objectives</h1>
      <p>Welcome to the official <strong>Ajaia Docs</strong> collaborative workspace! This document outlines our primary product goals and engineering deliverables for Q3.</p>
      
      <h2>1. Core Objectives</h2>
      <p>Our focus is delivering high-speed, intuitive productivity tools built for modern remote and hybrid teams.</p>
      <ul>
        <li><strong>Rich Text Editor:</strong> Support bold, italic, underline, headers, and bulleted/numbered lists with instant autosave.</li>
        <li><strong>Intelligent Import:</strong> Convert .txt, .md, and .docx files directly into editable web documents.</li>
        <li><strong>Granular Sharing:</strong> Role-based access control with explicit Owner, Editor, and Viewer privileges.</li>
      </ul>

      <h2>2. Key Deliverables</h2>
      <ol>
        <li>Full-stack Next.js architecture with SQLite relational storage.</li>
        <li>Instant account switcher for seamless multi-user permission verification.</li>
        <li>Export capabilities to Markdown, clean HTML, and Plain Text.</li>
      </ol>

      <blockquote>
        "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
      </blockquote>
    `,
    ownerId: 'usr_alex_01',
    owner: SEEDED_USERS[0],
    shares: [
      { id: 'sh_1', documentId: 'doc_product_roadmap', userId: 'usr_sarah_02', role: 'EDITOR', user: SEEDED_USERS[1], createdAt: new Date().toISOString() },
      { id: 'sh_2', documentId: 'doc_product_roadmap', userId: 'usr_devin_03', role: 'VIEWER', user: SEEDED_USERS[2], createdAt: new Date().toISOString() },
    ],
    histories: [
      {
        id: 'hist_1',
        documentId: 'doc_product_roadmap',
        title: 'Ajaia Product Roadmap & Q3 Objectives',
        content: '<h1>Ajaia Product Roadmap</h1><p>Initial snapshot</p>',
        savedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc_engineering_guidelines',
    title: 'Engineering Quality & Code Review Standards',
    content: `
      <h1>Engineering Quality & Code Review Standards</h1>
      <p>This internal guide specifies code style, commit standards, and automated testing requirements for Ajaia engineering teams.</p>
      <h2>Best Practices</h2>
      <ul>
        <li>Always test permission boundaries for shared endpoints.</li>
        <li>Maintain strict separation between business logic and UI presentation.</li>
        <li>Document architecture tradeoffs clearly in ARCHITECTURE.md.</li>
      </ul>
    `,
    ownerId: 'usr_alex_01',
    owner: SEEDED_USERS[0],
    shares: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Global in-memory storage singleton for serverless state
const globalStore = globalThis as unknown as {
  memoryDocs: DocumentItem[];
};

if (!globalStore.memoryDocs) {
  globalStore.memoryDocs = [...INITIAL_DOCUMENTS];
}

export function getMemoryDocs() {
  return globalStore.memoryDocs;
}

export function getMemoryDocById(id: string) {
  return globalStore.memoryDocs.find((d) => d.id === id) || null;
}

export function updateMemoryDoc(id: string, title?: string, content?: string) {
  const doc = getMemoryDocById(id);
  if (doc) {
    if (title !== undefined) doc.title = title;
    if (content !== undefined) doc.content = content;
    doc.updatedAt = new Date().toISOString();
  }
  return doc;
}

export function createMemoryDoc(title: string, content: string, ownerId: string) {
  const owner = SEEDED_USERS.find((u) => u.id === ownerId) || SEEDED_USERS[0];
  const newDoc: DocumentItem = {
    id: 'doc_' + Date.now(),
    title,
    content,
    ownerId,
    owner,
    shares: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  globalStore.memoryDocs.unshift(newDoc);
  return newDoc;
}

export function addMemoryShare(documentId: string, targetUserId: string, role: 'VIEWER' | 'EDITOR') {
  const doc = getMemoryDocById(documentId);
  const user = SEEDED_USERS.find((u) => u.id === targetUserId);
  if (doc && user) {
    doc.shares = doc.shares.filter((s) => s.userId !== targetUserId);
    const newShare = {
      id: 'sh_' + Date.now(),
      documentId,
      userId: targetUserId,
      role,
      user,
      createdAt: new Date().toISOString(),
    };
    doc.shares.push(newShare);
    return newShare;
  }
  return null;
}

export function removeMemoryShare(documentId: string, targetUserId: string) {
  const doc = getMemoryDocById(documentId);
  if (doc) {
    doc.shares = doc.shares.filter((s) => s.userId !== targetUserId);
    return true;
  }
  return false;
}
