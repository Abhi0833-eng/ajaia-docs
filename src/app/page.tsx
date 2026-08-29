'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TipTapEditor } from '@/components/TipTapEditor';
import { ShareModal } from '@/components/ShareModal';
import { FileUploadModal } from '@/components/FileUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { AIDraftModal } from '@/components/AIDraftModal';
import { VersionHistoryModal } from '@/components/VersionHistoryModal';
import { DocumentItem, User } from '@/lib/types';
import { Loader2, FilePlus } from 'lucide-react';

const DEFAULT_USER: User = {
  id: 'usr_alex_01',
  name: 'Alex Rivera',
  email: 'alex@ajaia.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
};

const DEFAULT_USERS_LIST: User[] = [
  DEFAULT_USER,
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

export default function Home() {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS_LIST);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [ownedDocs, setOwnedDocs] = useState<DocumentItem[]>([]);
  const [sharedDocs, setSharedDocs] = useState<DocumentItem[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIDraftModal, setShowAIDraftModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Load: Fetch Users & Docs
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok && data.users?.length > 0) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users from API, using default list:', err);
    }
  };

  // Fetch Documents when active user changes
  const fetchDocuments = useCallback(async (userId: string, selectDocId?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?userId=${userId}`, {
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      if (res.ok) {
        setOwnedDocs(data.owned || []);
        setSharedDocs(data.shared || []);

        const allDocs: DocumentItem[] = [...(data.owned || []), ...(data.shared || [])];

        if (allDocs.length > 0) {
          if (selectDocId) {
            const target = allDocs.find((d) => d.id === selectDocId) || allDocs[0];
            setCurrentDoc(target);
          } else {
            setCurrentDoc(allDocs[0]);
          }
        } else {
          setCurrentDoc(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchDocuments(currentUser.id);
    }
  }, [currentUser, fetchDocuments]);

  // Switch Active Test User
  const handleSwitchUser = (newUser: User) => {
    setCurrentUser(newUser);
  };

  // Create New Blank Document
  const handleCreateDocument = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          title: 'Untitled Document',
          content: '<h1>Untitled Document</h1><p>Start typing your content here...</p>',
        }),
      });

      const data = await res.json();
      if (res.ok && data.document) {
        fetchDocuments(currentUser.id, data.document.id);
      }
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  // Delete Document (Owner only)
  const handleDeleteDocument = async (docId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id },
      });
      if (res.ok) {
        fetchDocuments(currentUser.id);
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  // Autosave Handler
  const handleDocChange = (newHtml: string) => {
    if (!currentDoc || currentDoc.currentUserRole === 'VIEWER') return;

    setCurrentDoc((prev) => (prev ? { ...prev, content: newHtml } : null));
    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocumentChanges(currentDoc.id, currentDoc.title, newHtml);
    }, 1200);
  };

  const handleTitleUpdate = (newTitle: string) => {
    if (!currentDoc || currentDoc.currentUserRole === 'VIEWER') return;

    setCurrentDoc((prev) => (prev ? { ...prev, title: newTitle } : null));
    saveDocumentChanges(currentDoc.id, newTitle, currentDoc.content);
  };

  const saveDocumentChanges = async (docId: string, title: string, content: string) => {
    if (!currentUser) return;
    setSaveStatus('saving');

    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setSaveStatus('saved');
        setOwnedDocs((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, title, content } : d))
        );
        setSharedDocs((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, title, content } : d))
        );
      } else {
        setSaveStatus('unsaved');
      }
    } catch (err) {
      console.error('Autosave error:', err);
      setSaveStatus('unsaved');
    }
  };

  // Grant Share Permission
  const handleGrantShare = async (targetUserId: string, role: 'VIEWER' | 'EDITOR') => {
    if (!currentDoc || !currentUser) return;

    const res = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUser.id,
      },
      body: JSON.stringify({
        documentId: currentDoc.id,
        targetUserId,
        role,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to share document');
    }

    fetchDocuments(currentUser.id, currentDoc.id);
  };

  // Revoke Share Permission
  const handleRevokeShare = async (targetUserId: string) => {
    if (!currentDoc || !currentUser) return;

    const res = await fetch(
      `/api/share?documentId=${currentDoc.id}&userId=${targetUserId}`,
      {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to revoke access');
    }

    fetchDocuments(currentUser.id, currentDoc.id);
  };

  // Handle Imported Upload Document
  const handleUploadSuccess = (uploadedResult: any) => {
    if (currentUser) {
      if (uploadedResult.id) {
        fetchDocuments(currentUser.id, uploadedResult.id);
      } else if (uploadedResult.html && currentDoc) {
        const appendedContent = currentDoc.content + uploadedResult.html;
        handleDocChange(appendedContent);
      }
    }
  };

  // Append AI Content
  const handleInsertAIContent = (aiHtml: string) => {
    if (currentDoc) {
      const updated = currentDoc.content + aiHtml;
      handleDocChange(updated);
    }
  };

  // Restore History Version
  const handleRestoreHistory = async (historyId: string) => {
    if (!currentUser || !currentDoc) return;

    const res = await fetch(`/api/history/${historyId}`, {
      method: 'POST',
      headers: { 'x-user-id': currentUser.id },
    });

    if (res.ok) {
      fetchDocuments(currentUser.id, currentDoc.id);
    } else {
      const data = await res.json();
      throw new Error(data.error || 'Failed to restore history snapshot');
    }
  };

  const isReadOnly = currentDoc?.currentUserRole === 'VIEWER';

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        ownedDocs={ownedDocs}
        sharedDocs={sharedDocs}
        currentDocId={currentDoc?.id || null}
        currentUser={currentUser}
        onSelectDoc={(id) => {
          const doc = [...ownedDocs, ...sharedDocs].find((d) => d.id === id);
          if (doc) setCurrentDoc(doc);
        }}
        onCreateDoc={handleCreateDocument}
        onOpenUpload={() => setShowUploadModal(true)}
        onDeleteDoc={handleDeleteDocument}
      />

      {/* Main Surface */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header
          document={currentDoc}
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
          onUpdateTitle={handleTitleUpdate}
          onOpenShare={() => setShowShareModal(true)}
          onOpenExport={() => setShowExportModal(true)}
          onOpenAIDraft={() => setShowAIDraftModal(true)}
          onOpenHistory={() => setShowHistoryModal(true)}
          saveStatus={saveStatus}
          isReadOnly={isReadOnly}
        />

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-950">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
            <span className="text-xs">Loading document...</span>
          </div>
        ) : currentDoc ? (
          <TipTapEditor
            key={currentDoc.id}
            content={currentDoc.content}
            onChange={handleDocChange}
            isReadOnly={isReadOnly}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-950 p-6 text-center">
            <FilePlus className="w-12 h-12 text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-slate-200">No Document Selected</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Select a document from the left sidebar, or create a new blank document to start editing.
            </p>
            <button
              onClick={handleCreateDocument}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              Create New Document
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showShareModal && currentDoc && (
        <ShareModal
          document={currentDoc}
          allUsers={users}
          currentUser={currentUser}
          onClose={() => setShowShareModal(false)}
          onGrantShare={handleGrantShare}
          onRevokeShare={handleRevokeShare}
        />
      )}

      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
          currentUserId={currentUser.id}
        />
      )}

      {showExportModal && currentDoc && (
        <ExportModal document={currentDoc} onClose={() => setShowExportModal(false)} />
      )}

      {showAIDraftModal && currentDoc && (
        <AIDraftModal
          documentTitle={currentDoc.title}
          documentContent={currentDoc.content}
          onInsertContent={handleInsertAIContent}
          onClose={() => setShowAIDraftModal(false)}
        />
      )}

      {showHistoryModal && currentDoc && (
        <VersionHistoryModal
          documentId={currentDoc.id}
          currentUserId={currentUser.id}
          onClose={() => setShowHistoryModal(false)}
          onRestore={handleRestoreHistory}
        />
      )}
    </div>
  );
}
