'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Download,
  Sparkles,
  History,
  CheckCircle2,
  Clock,
  Lock,
  UserCheck,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { DocumentItem, User } from '@/lib/types';

interface HeaderProps {
  document: DocumentItem | null;
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  onUpdateTitle: (title: string) => void;
  onOpenShare: () => void;
  onOpenExport: () => void;
  onOpenAIDraft: () => void;
  onOpenHistory: () => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isReadOnly: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  document,
  currentUser,
  allUsers,
  onSwitchUser,
  onUpdateTitle,
  onOpenShare,
  onOpenExport,
  onOpenAIDraft,
  onOpenHistory,
  saveStatus,
  isReadOnly,
}) => {
  const [title, setTitle] = useState(document?.title || '');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
    }
  }, [document?.title]);

  const handleTitleBlur = () => {
    if (document && title.trim() !== document.title) {
      onUpdateTitle(title.trim() || 'Untitled Document');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Left section: Doc title & status */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              disabled={isReadOnly || !document}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              placeholder="Untitled Document"
              className="bg-transparent text-slate-100 text-lg font-semibold border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors duration-150 truncate max-w-md px-1 py-0.5 disabled:cursor-not-allowed"
            />
            {isReadOnly && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                <Lock className="w-3 h-3" /> View Only
              </span>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 px-1 mt-0.5">
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Saved to cloud
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-indigo-400 animate-pulse">
                <Clock className="w-3 h-3 animate-spin" /> Saving changes...
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="w-3 h-3" /> Unsaved changes
              </span>
            )}

            {document && (
              <>
                <span className="text-slate-600">•</span>
                <span>
                  Role:{' '}
                  <strong className="text-slate-300">
                    {document.currentUserRole || 'OWNER'}
                  </strong>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons & Account Switcher */}
      <div className="flex items-center gap-2">
        {document && (
          <>
            <button
              onClick={onOpenAIDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-900/30 border border-purple-500/30 rounded-lg hover:bg-purple-900/50 transition-all duration-200 shadow-sm"
              title="AI Writing Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Assist</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700/80 rounded-lg hover:bg-slate-700/80 transition-all duration-200"
              title="Version History"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>History</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700/80 rounded-lg hover:bg-slate-700/80 transition-all duration-200"
              title="Export Document"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>

            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all duration-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </>
        )}

        <div className="h-6 w-[1px] bg-slate-800 mx-1" />

        {/* User Context Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/90 transition-all text-xs text-slate-200"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center font-bold text-indigo-300 text-[10px]">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400">{currentUser.email}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-2">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Active Test User
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Test owned vs shared permission logic
                </p>
              </div>

              <div className="py-1">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                    {u.id === currentUser.id && (
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
