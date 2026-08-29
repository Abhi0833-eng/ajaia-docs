'use client';

import React, { useState, useEffect } from 'react';
import { X, History, RotateCcw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { HistoryItem } from '@/lib/types';

interface VersionHistoryModalProps {
  documentId: string;
  currentUserId: string;
  onClose: () => void;
  onRestore: (historyId: string) => Promise<void>;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  documentId,
  currentUserId,
  onClose,
  onRestore,
}) => {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistories();
  }, [documentId]);

  const fetchHistories = async () => {
    try {
      const res = await fetch(`/api/history/${documentId}`);
      const data = await res.json();
      if (res.ok) {
        setHistories(data.histories || []);
        if (data.histories && data.histories.length > 0) {
          setSelectedHistory(data.histories[0]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreClick = async () => {
    if (!selectedHistory) return;
    if (!confirm('Restore document to this version? Current changes will be overwritten.')) return;

    setRestoring(true);
    try {
      await onRestore(selectedHistory.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to restore snapshot');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-[#0000] bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Document Version History</h3>
              <p className="text-xs text-slate-400">View and restore previous revision snapshots</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Snapshot list */}
          <div className="w-64 border-r border-slate-800 bg-slate-950/40 p-3 overflow-y-auto custom-scrollbar space-y-1.5 shrink-0">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Auto-saved Snapshots
            </div>

            {loading ? (
              <div className="text-xs text-slate-500 py-4 text-center">Loading revisions...</div>
            ) : histories.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">No history snapshots saved yet</div>
            ) : (
              histories.map((h, idx) => {
                const isSelected = selectedHistory?.id === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHistory(h)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200 font-medium'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(h.savedAt).toLocaleString()}</span>
                    </div>
                    <div className="truncate font-semibold text-slate-200">{h.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {idx === 0 ? 'Current Snapshot' : `Revision #${histories.length - idx}`}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Snapshot Preview */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950 flex flex-col">
            {selectedHistory ? (
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{selectedHistory.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      Snapshot taken at {new Date(selectedHistory.savedAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleRestoreClick}
                    disabled={restoring}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{restoring ? 'Restoring...' : 'Restore This Version'}</span>
                  </button>
                </div>

                <div
                  className="prose prose-invert max-w-none text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner"
                  dangerouslySetInnerHTML={{ __html: selectedHistory.content }}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Select a version from the left panel to preview content
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
