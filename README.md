# 🚀 Ajaia Docs - AI-Native Full Stack Collaborative Document Editor

A lightweight, high-performance collaborative document editing application inspired by Google Docs, built for **Ajaia LLC's AI-Native Full Stack Developer Assignment**.

Candidate: **Abhishek Gupta** ([abhishekgupta0834@gmail.com](mailto:abhishekgupta0834@gmail.com))

---

## 🌟 Key Product Capabilities

1. **Rich Text Editing Surface (TipTap / ProseMirror)**
   - Bold, Italic, Underline (`Ctrl+B`, `Ctrl+I`, `Ctrl+U`).
   - Heading levels (`H1`, `H2`, `H3`).
   - Bulleted & Numbered lists.
   - Blockquotes, Text alignment (Left, Center, Right).
   - Live document statistics: Word count, Character count, Reading time.
   - Automatic debounced cloud save.

2. **File Upload & Intelligent Document Import**
   - Supports importing `.txt`, `.md`, and `.docx` files.
   - Automatically converts imported documents into clean HTML structure and opens them directly as editable drafts.

3. **Role-Based Sharing & Permission Security**
   - **Document Owner**: Full edit, rename, share, and delete authority.
   - **Editor**: Full document content edit and title update authority.
   - **Viewer**: Read-only mode with active toolbar lock banner.
   - Tabbed navigation separating **My Documents** from **Shared With Me**.

4. **1-Click User Context Switcher (Reviewer Friendly)**
   - Top-right dropdown menu to instantly swap active user sessions between:
     - 👤 **Alex Rivera** (`alex@ajaia.com`) — Owner of primary roadmap doc
     - 👤 **Sarah Chen** (`sarah@ajaia.com`) — Granted **EDITOR** permissions
     - 👤 **Devin Miller** (`devin@ajaia.com`) — Granted **VIEWER** permissions

5. **Relational Persistence & Version History**
   - SQLite database via Prisma ORM storing Users, Documents, Shares, and Revision Snapshots.
   - Revision history modal allows previewing and restoring past snapshots.

6. **Export & AI Writing Assistant**
   - Export documents to **Markdown (.md)**, **HTML (.html)**, or **Plain Text (.txt)**.
   - AI Assistant generates summaries, outlines, action item lists, or expanded drafts.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 / Next.js 16 (App Router / TypeScript)
- **Editor Engine**: `@tiptap/react` & `@tiptap/starter-kit` (ProseMirror core)
- **Database & ORM**: SQLite (`prisma/dev.db`) + Prisma ORM 5
- **File Processing**: `mammoth` (DOCX -> HTML), `marked` (Markdown -> HTML)
- **Styling**: Tailwind CSS + Lucide Icons + Dark Glassmorphic Design System
- **Testing**: Vitest unit & integration test suite

---

## ⚡ Quick Start & Local Setup Instructions

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd ajaia-docs
npm install --legacy-peer-deps
```

### 2. Setup Database & Seed Data
```bash
# Push Prisma schema to SQLite database
npm run db:push

# Seed test accounts and initial documents
node prisma/seed.js
```

### 3. Run Automated Test Suite
```bash
npm test
```
*Executes all 7 Vitest unit & integration tests for file parsing and permission checking logic.*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Sharing & Permission Logic

1. Open the application at `http://localhost:3000`. By default, you are logged in as **Alex Rivera (Owner)**.
2. Select **"Ajaia Product Roadmap & Q3 Objectives"**. Notice you can edit, format text, and click **Share**.
3. In the top-right header, open the **User Switcher** dropdown and click **Devin Miller**.
4. Notice the banner: **"Read-Only Mode: You have Viewer permissions"**. Formatting buttons are disabled and content changes are rejected by backend security.
5. Switch to **Sarah Chen** to experience **Can Edit** collaborator rights.

---

## 📄 Included Documentation

- [ARCHITECTURE.md](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/ARCHITECTURE.md) — Architecture decisions, scope cuts, and security tradeoffs.
- [AI_WORKFLOW.md](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/AI_WORKFLOW.md) — Detailed report on AI coding assistant usage, prompt iterations, rejected output, and verification.
- [SUBMISSION.md](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/SUBMISSION.md) — Complete submission package formatted for the Ajaia candidate portal.
- [WALKTHROUGH.md](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/WALKTHROUGH.md) — Video script & feature walkthrough guide.
