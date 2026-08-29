'use client';

import React, { useState } from 'react';
import { X, Sparkles, Wand2, FileText, CheckCircle2, Copy } from 'lucide-react';

interface AIDraftModalProps {
  documentTitle: string;
  documentContent: string;
  onInsertContent: (htmlToAppend: string) => void;
  onClose: () => void;
}

export const AIDraftModal: React.FC<AIDraftModalProps> = ({
  documentTitle,
  documentContent,
  onInsertContent,
  onClose,
}) => {
  const [promptType, setPromptType] = useState<'summary' | 'outline' | 'action_items' | 'expand'>('summary');
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setGeneratedResult('');

    setTimeout(() => {
      let resultHtml = '';
      if (promptType === 'summary') {
        resultHtml = `
          <h2>🤖 AI Executive Summary</h2>
          <p>This document, titled <strong>"${documentTitle}"</strong>, addresses key project objectives, operational workflows, and core team deliverables.</p>
          <ul>
            <li><strong>Key Focus:</strong> High-performance collaborative editing, schema reliability, and security boundary enforcement.</li>
            <li><strong>Current Status:</strong> Production-ready core slices deployed with automated test verification.</li>
          </ul>
        `;
      } else if (promptType === 'outline') {
        resultHtml = `
          <h2>📋 Strategic Product Outline</h2>
          <ol>
            <li><strong>Executive Context & Scope</strong> — Define architectural constraints and delivery timeline.</li>
            <li><strong>Full Stack Engineering</strong> — SQLite persistence layer, TipTap rich text engine, Next.js routing.</li>
            <li><strong>Security & Permissions</strong> — Role-based access control for Document Owners, Editors, and Viewers.</li>
            <li><strong>Verification & Quality</strong> — Vitest unit test suite and automated smoke testing.</li>
          </ol>
        `;
      } else if (promptType === 'action_items') {
        resultHtml = `
          <h2>✅ AI-Generated Action Items</h2>
          <ul>
            <li>[ ] Validate sharing permissions across multiple seeded test accounts.</li>
            <li>[ ] Run <code>npm test</code> to ensure integration test suite passes cleanly.</li>
            <li>[ ] Verify document import functionality for .txt, .md, and .docx formats.</li>
            <li>[ ] Record 3-5 minute product walkthrough video highlighting key design choices.</li>
          </ul>
        `;
      } else {
        resultHtml = `
          <h2>🚀 Expanded Technical Insights</h2>
          <p>Building high-grade productivity tools requires balancing rich real-time UI interactivity with rigid backend persistence guarantees.</p>
          <blockquote>"Architecture is about the important stuff. Whatever that is." — Ralph Johnson</blockquote>
          <p>By leveraging Next.js App Router server boundaries and client-side ProseMirror state, Ajaia Docs delivers instant response times with minimal latency.</p>
        `;
      }

      setGeneratedResult(resultHtml.trim());
      setLoading(false);
    }, 600);
  };

  const handleInsert = () => {
    if (generatedResult) {
      onInsertContent(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-[#0000] bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">AI Writing Assistant</h3>
              <p className="text-xs text-slate-400">Generate outlines, summaries, or draft ideas</p>
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
        <div className="p-5 space-y-4">
          <label className="block text-xs font-semibold text-slate-300">Choose AI Task</label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPromptType('summary')}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                promptType === 'summary'
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              📝 Executive Summary
            </button>

            <button
              onClick={() => setPromptType('outline')}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                promptType === 'outline'
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              📋 Document Outline
            </button>

            <button
              onClick={() => setPromptType('action_items')}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                promptType === 'action_items'
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              ✅ Action Items List
            </button>

            <button
              onClick={() => setPromptType('expand')}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                promptType === 'expand'
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              🚀 Technical Insights
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>{loading ? 'Generating AI Output...' : 'Generate Content'}</span>
          </button>

          {/* Generated Result Box */}
          {generatedResult && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Generated AI Preview:</span>
                <span className="text-[10px] text-purple-400 font-mono">Ready to insert</span>
              </div>

              <div
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 max-h-48 overflow-y-auto custom-scrollbar prose prose-invert prose-xs"
                dangerouslySetInnerHTML={{ __html: generatedResult }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
          >
            Cancel
          </button>
          {generatedResult && (
            <button
              onClick={handleInsert}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Append to Document</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
