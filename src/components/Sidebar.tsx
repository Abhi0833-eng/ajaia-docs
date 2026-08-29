'use client';

import React, { useState } from 'react';
import {
  Plus,
  Upload,
  FileText,
  Users,
  Search,
  Trash2,
  Lock,
  Edit3,
  Eye,
  FilePlus,
  Sparkles,
} from 'lucide-react';
import { DocumentItem, User } from '@/lib/types';

interface SidebarProps {
  ownedDocs: DocumentItem[];
  sharedDocs: DocumentItem[];
  currentDocId: string | null;
  currentUser: User;
  onSelectDoc: (docId: string) => void;
  onCreateDoc: () => void;
  onOpenUpload: () => void;
  onDeleteDoc: (docId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  ownedDocs,
  sharedDocs,
  currentDocId,
  currentUser,
  onSelectDoc,
  onCreateDoc,
  onOpenUpload,
  onDeleteDoc,
}) => {
  const [activeTab, setActiveTab] = useState<'owned' | 'shared'>('owned');
  const [searchQuery, setSearchQuery] = useState('');

  const docsToDisplay = activeTab === 'owned' ? ownedDocs : sharedDocs;
  const filteredDocs = docsToDisplay.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">
              Ajaia Docs
            </h1>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wide">
              Collaborative Editor
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 space-y-2">
        <button
          onClick={onCreateDoc}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Blank Document</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 rounded-lg font-medium text-xs transition-all"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Import (.txt, .md, .docx)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-3">
        <button
          onClick={() => setActiveTab('owned')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'owned'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Docs ({ownedDocs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shared')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'shared'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Shared ({sharedDocs.length})</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1 custom-scrollbar">
        {filteredDocs.length === 0 ? (
          <div className="py-8 text-center px-4">
            <FilePlus className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">No documents found</p>
            <p className="text-[11px] text-slate-600 mt-1">
              {activeTab === 'owned'
                ? 'Create a new document to get started.'
                : 'Documents shared with you will appear here.'}
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = doc.id === currentDocId;
            const isOwner = doc.ownerId === currentUser.id;

            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-200'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <FileText
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="truncate">
                    <div className="text-xs font-medium truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                      {!isOwner && (
                        <span className="flex items-center gap-0.5 text-indigo-400 font-semibold">
                          {doc.currentUserRole === 'EDITOR' ? (
                            <>
                              <Edit3 className="w-2.5 h-2.5" /> Can Edit
                            </>
                          ) : (
                            <>
                              <Eye className="w-2.5 h-2.5" /> Can View
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Owner Delete Button */}
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete document "${doc.title}"?`)) {
                        onDeleteDoc(doc.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-opacity"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Profile summary */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px]">System Ready</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">SQLite / Next.js</span>
      </div>
    </aside>
  );
};
