'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  RemoveFormatting,
  Lock,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  isReadOnly: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, isReadOnly }) => {
  if (!editor) return null;

  if (isReadOnly) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>
            <strong>Read-Only Mode:</strong> You have Viewer permissions for this document. Request Editor access to make changes.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 flex items-center gap-1 overflow-x-auto select-none sticky top-16 z-20 shadow-sm">
      {/* Formatting buttons */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('bold')
            ? 'bg-indigo-600 text-white font-bold'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('italic')
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('underline')
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="h-4 w-[1px] bg-slate-800 mx-1" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="h-4 w-[1px] bg-slate-800 mx-1" />

      {/* Lists & Quotes */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('bulletList')
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Bulleted List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('orderedList')
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive('blockquote')
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="h-4 w-[1px] bg-slate-800 mx-1" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive({ textAlign: 'left' })
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive({ textAlign: 'center' })
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1.5 rounded transition-colors ${
          editor.isActive({ textAlign: 'right' })
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="h-4 w-[1px] bg-slate-800 mx-1" />

      {/* Clear Formatting */}
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>

      <div className="h-4 w-[1px] bg-slate-800 mx-1" />

      {/* Undo / Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 rounded transition-colors"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 rounded transition-colors"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};
