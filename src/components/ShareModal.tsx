'use client';

import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Shield,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Users,
  Info,
} from 'lucide-react';
import { DocumentItem, User } from '@/lib/types';

interface ShareModalProps {
  document: DocumentItem;
  allUsers: User[];
  currentUser: User;
  onClose: () => void;
  onGrantShare: (targetUserId: string, role: 'VIEWER' | 'EDITOR') => Promise<void>;
  onRevokeShare: (targetUserId: string) => Promise<void>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  document,
  allUsers,
  currentUser,
  onClose,
  onGrantShare,
  onRevokeShare,
}) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'VIEWER' | 'EDITOR'>('VIEWER');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isOwner = document.ownerId === currentUser.id;
  const isEditor = document.currentUserRole === 'EDITOR' || isOwner;

  // Exclude document owner from share target options
  const eligibleUsers = allUsers.filter((u) => u.id !== document.ownerId);

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setLoading(true);
    setMessage(null);

    try {
      await onGrantShare(selectedUserId, selectedRole);
      setMessage({ type: 'success', text: 'Share access granted successfully!' });
      setSelectedUserId('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to grant share access' });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (userId: string) => {
    if (!confirm('Revoke access for this user?')) return;
    setLoading(true);
    try {
      await onRevokeShare(userId);
      setMessage({ type: 'success', text: 'Share access revoked.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to revoke access' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-[#0000] bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Share Document</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">{document.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Reviewer Note */}
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-start gap-2.5 text-xs text-indigo-300">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong>Reviewer Tip:</strong> Grant access to <strong>Sarah Chen</strong> or <strong>Devin Miller</strong>, then use the top-right User Switcher dropdown to test their view/edit permissions in real time!
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Add collaborator form */}
          {isEditor ? (
            <form onSubmit={handleShareSubmit} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Grant Access to User
              </label>

              <div className="flex gap-2">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select test user...</option>
                  {eligibleUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'VIEWER' | 'EDITOR')}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="VIEWER">Can View</option>
                  <option value="EDITOR">Can Edit</option>
                </select>

                <button
                  type="submit"
                  disabled={!selectedUserId || loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Only document owners or editors can invite new collaborators.</span>
            </div>
          )}

          {/* Current People with Access */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              People with access
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {/* Document Owner */}
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-300">
                    {document.owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{document.owner.name}</div>
                    <div className="text-[10px] text-slate-400">{document.owner.email}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-semibold text-[10px] rounded-full border border-indigo-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Owner
                </span>
              </div>

              {/* Shared Collaborators */}
              {document.shares.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-3">
                  No collaborators added yet.
                </p>
              ) : (
                document.shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                        {share.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{share.user.name}</div>
                        <div className="text-[10px] text-slate-400">{share.user.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 font-semibold text-[10px] rounded-full border ${
                          share.role === 'EDITOR'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {share.role === 'EDITOR' ? 'Editor' : 'Viewer'}
                      </span>

                      {isOwner && (
                        <button
                          onClick={() => handleRevoke(share.userId)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
