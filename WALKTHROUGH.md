# 📹 Walkthrough Video Script & Product Demo Guide - Ajaia Docs

Candidate: **Abhishek Gupta** ([abhishekgupta0834@gmail.com](mailto:abhishekgupta0834@gmail.com))

Video URL Placeholder: `https://youtu.be/sample-walkthrough-link`

---

## 🎙️ 3-5 Minute Video Outline & Key Talking Points

### 1. Introduction & Product Overview (0:00 - 0:45)
- **Greeting & Objective**: "Hi team Ajaia, I'm Abhishek Gupta. This is my submission for the AI-Native Full Stack Developer assignment: **Ajaia Docs**."
- **High Level Architecture**: "Ajaia Docs is a lightweight Google Docs alternative built with Next.js 14, TipTap ProseMirror rich text engine, Tailwind CSS, and SQLite via Prisma ORM."

### 2. Core User Flow & Editing Surface (0:45 - 1:45)
- **Document Creation & Formatting**: Demonstrate creating a new document, updating the title, and applying rich-text styles (Bold `Ctrl+B`, Italic `Ctrl+I`, Underline `Ctrl+U`, Headings `H1-H3`, Bulleted/Numbered lists, Blockquotes).
- **Autosave & Stats**: Highlight the top status badge ("Saved to cloud") and bottom metrics bar showing real-time word count, character count, and reading time.

### 3. File Upload & Import Feature (1:45 - 2:30)
- **Importing Files**: Click **Import (.txt, .md, .docx)** in the left sidebar.
- **Drag & Drop**: Drag a `.md` or `.docx` file into the dropzone. Demonstrate how content is automatically converted into clean HTML headings and appended into an editable document.

### 4. Role-Based Sharing & Instant User Switcher (2:30 - 3:45)
- **Owner View**: Show document sharing modal. Invite **Sarah Chen** as `Editor` and **Devin Miller** as `Viewer`.
- **User Context Switcher**: Click top-right account dropdown and switch to **Devin Miller**.
- **Viewer Mode Enforcement**: Point out the **"Read-Only Mode: You have Viewer permissions"** banner. Demonstrate how formatting buttons are locked and content edits are blocked.
- **Editor Mode**: Switch to **Sarah Chen** to demonstrate collaborator editing.

### 5. Version History & Export Features (3:45 - 4:30)
- **Version Snapshots**: Open **History** modal to view auto-saved revision snapshots and restore previous versions.
- **Exporting**: Click **Export** to download the document as Markdown (`.md`), HTML (`.html`), or Plain Text (`.txt`).
- **AI Writing Assistant**: Trigger **AI Assist** to generate outlines and summaries.

### 6. AI Workflow & Engineering Quality Wrap-up (4:30 - 5:00)
- **AI Tool Usage**: Explain how Gemini / Cursor accelerated Prisma schema generation and file parsing logic while manual human refactoring enforced security boundaries and pinned stable dependencies.
- **Automated Tests**: Mention running `npm test` with 7 passing Vitest unit/integration tests.
