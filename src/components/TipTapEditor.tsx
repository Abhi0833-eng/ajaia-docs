'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import { EditorToolbar } from './EditorToolbar';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  isReadOnly: boolean;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  isReadOnly,
}) => {
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Replaced by custom heading extension
      }),
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content || '<p></p>',
    editable: !isReadOnly,
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[650px] p-8 text-slate-100 selection:bg-indigo-500/30 font-sans leading-relaxed',
      },
    },
  });

  // Sync content when document changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      isUpdatingRef.current = true;
      editor.commands.setContent(content || '<p></p>');
      isUpdatingRef.current = false;
    }
  }, [content, editor]);

  // Sync editable status when permission changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isReadOnly);
    }
  }, [isReadOnly, editor]);

  // Compute metrics
  const text = editor ? editor.getText() : '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="flex flex-col flex-1 h-full bg-slate-950 overflow-hidden">
      {/* Rich Text Toolbar */}
      <EditorToolbar editor={editor} isReadOnly={isReadOnly} />

      {/* Editor Main Canvas (Google Docs page layout) */}
      <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar flex justify-center">
        <div className="w-full max-w-3xl min-h-[850px] bg-slate-900 border border-slate-800/80 rounded-xl shadow-2xl transition-all duration-200">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Document Stats Bar */}
      <div className="h-8 border-t border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-4">
          <span>
            Words: <strong className="text-slate-200">{words}</strong>
          </span>
          <span>
            Characters: <strong className="text-slate-200">{characters}</strong>
          </span>
          <span>
            Est. Reading Time: <strong className="text-slate-200">{readingTimeMinutes} min</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-indigo-400 font-medium">
          TipTap / ProseMirror Core Engine
        </div>
      </div>
    </div>
  );
};
