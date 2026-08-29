'use client';

import React from 'react';
import { X, Download, FileCode, FileText, Code } from 'lucide-react';
import { DocumentItem } from '@/lib/types';
import { exportDocumentAsFile } from '@/lib/export';

interface ExportModalProps {
  document: DocumentItem;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ document, onClose }) => {
  const handleExport = (format: 'md' | 'html' | 'txt') => {
    exportDocumentAsFile(document.title, document.content, format);
    onClose();
  };

  return (
    <div className="fixed inset-[#0000] bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Export Document</h3>
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

        {/* Export Options */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-400 mb-2">
            Select export format to download to your local machine:
          </p>

          <button
            onClick={() => handleExport('md')}
            className="w-full p-3.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400">
                  Markdown (.md)
                </div>
                <div className="text-[10px] text-slate-400">
                  Best for GitHub, Notion, and technical documentation
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
          </button>

          <button
            onClick={() => handleExport('html')}
            className="w-full p-3.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400">
                  HTML Web Page (.html)
                </div>
                <div className="text-[10px] text-slate-400">
                  Preserves all rich formatting, styles, and list structures
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
          </button>

          <button
            onClick={() => handleExport('txt')}
            className="w-full p-3.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400">
                  Plain Text (.txt)
                </div>
                <div className="text-[10px] text-slate-400">
                  Universal raw unformatted text export
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
