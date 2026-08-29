# 🚀 Ajaia LLC - AI-Native Full Stack Developer Assignment Submission

Candidate Name: **Abhishek Gupta**  
Email: [abhishekgupta0834@gmail.com](mailto:abhishekgupta0834@gmail.com)  
GitHub Profile: [https://github.com/Abhi0833-eng](https://github.com/Abhi0833-eng)  
Project Name: **Ajaia Docs**  
Date: **August 29, 2026**

---

## 📋 Deliverables Summary

| Deliverable | Location / Details |
| :--- | :--- |
| **GitHub Source Code Repository** | [https://github.com/Abhi0833-eng/ajaia-docs](https://github.com/Abhi0833-eng/ajaia-docs) |
| **Local Setup Guide** | [`README.md`](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/README.md) |
| **Architecture & Tradeoffs Note** | [`ARCHITECTURE.md`](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/ARCHITECTURE.md) |
| **AI-Native Workflow Note** | [`AI_WORKFLOW.md`](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/AI_WORKFLOW.md) |
| **Product Walkthrough Guide** | [`WALKTHROUGH.md`](file:///C:/Users/abhis/.gemini/antigravity-ide/scratch/ajaia-docs/WALKTHROUGH.md) |
| **Walkthrough Video URL** | `https://youtu.be/sample-walkthrough-link` *(Placeholder)* |
| **Live Product Deployment URL** | `https://rich-things-yell.loca.lt` *(Live Public Host)* |

---

## 🔑 Pre-seeded Reviewer Test Accounts

To make reviewing permissions seamless without creating accounts:

| User Name | Email | Default Role in Sample Doc | Testing Capability |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex@ajaia.com` | **Document Owner** | Can edit title/content, invite collaborators, delete doc |
| **Sarah Chen** | `sarah@ajaia.com` | **Shared Editor** | Can edit title/content, invite collaborators |
| **Devin Miller** | `devin@ajaia.com` | **Shared Viewer** | Read-only mode, toolbar locked, editing blocked |

*Use the **Top-Right User Switcher** dropdown to swap active user sessions in 1 click!*

---

## ✅ Status of Core Capabilities

### 1. Document Creation and Editing — **Completed (100%)**
- Create new blank document
- Rename document with blur save
- Edit content in browser via TipTap/ProseMirror engine
- Formatting: Bold, Italic, Underline, H1/H2/H3 Headings, Bulleted & Numbered lists, Blockquotes, Text alignment
- Word count, Character count, and Reading time bar
- Autosave to SQLite cloud store

### 2. File Upload & Import — **Completed (100%)**
- Drag and drop modal supporting `.txt`, `.md`, and `.docx`
- Automatic conversion into editable rich HTML format
- Appends to current document or creates new document

### 3. Sharing & Access Model — **Completed (100%)**
- Explicit Document Owner vs Collaborator logic
- Share modal to invite users by email or selection with `Can View` or `Can Edit` roles
- Tabbed separation between **My Documents** and **Shared With Me**
- Instant user switcher for reviewer testing

### 4. Persistence — **Completed (100%)**
- SQLite database via Prisma ORM storing Users, Documents, Shares, and Revision Snapshots
- Data persists across browser refresh
- Document version history snapshot preview & restoration

### 5. Product & Engineering Quality — **Completed (100%)**
- Clear setup and run instructions
- 7 automated Vitest unit & integration tests passing (`npm test`)
- Architecture note & AI workflow note included

---

## 🛠️ Instructions to Run Locally

```bash
# 1. Clone repository
git clone https://github.com/Abhi0833-eng/ajaia-docs.git
cd ajaia-docs

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Push Prisma schema & seed test data
npm run db:push
node prisma/seed.js

# 4. Run automated tests
npm test

# 5. Start dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to test.
