'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface FileUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (newDoc: any) => void;
  currentUserId: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  onClose,
  onUploadSuccess,
  currentUserId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'new_doc' | 'import_content'>('new_doc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['txt', 'md', 'markdown', 'docx'].includes(extension)) {
      setError(`Unsupported file format ".${extension}". Only .txt, .md, and .docx are supported.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-user-id': currentUserId,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      onUploadSuccess(data.document || data.parsed);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
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
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Import Document File</h3>
              <p className="text-xs text-slate-400">Convert .txt, .md, or .docx into an editable document</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Supported Format Badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Supported Formats:</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[10px] font-semibold">
              .txt
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[10px] font-semibold">
              .md
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[10px] font-semibold">
              .docx
            </span>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-600/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".txt,.md,.markdown,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-indigo-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">{file.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="ml-2 text-xs text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="text-xs text-slate-300 font-medium">
                  Click to choose a file or drag & drop here
                </div>
                <p className="text-[11px] text-slate-500">Maximum file size: 10MB</p>
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Import & Open Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
