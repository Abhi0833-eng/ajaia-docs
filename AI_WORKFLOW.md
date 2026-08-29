# 🤖 AI-Native Workflow Note - Ajaia Docs

Candidate: **Abhishek Gupta** ([abhishekgupta0834@gmail.com](mailto:abhishekgupta0834@gmail.com))

---

## 1. AI Tools Utilized

For this assignment, AI tools were used as an **accelerated pair programmer** rather than an automated code generator:
- **Google Antigravity Assistant (Gemini 3.6 Flash / Advanced Agentic Coding)** — Used for schema scaffolding, component layout generation, file parsing logic, and writing test suites.
- **Claude / Cursor Style In-line Assistance** — Used for quick type signature checks and CSS utility refactoring.

---

## 2. Where AI Materially Accelerated Delivery

1. **Database Schema & Prisma Setup**:
   - AI generated the initial `schema.prisma` models for `User`, `Document`, `Share`, and `History` in under 30 seconds.
   - Sped up relational mapping and composite index generation (`@@unique([documentId, userId])`).

2. **File Parsing Boilerplate (`mammoth` & `marked`)**:
   - AI drafted the buffer handling logic in `src/lib/fileParser.ts` for converting `.docx` buffers via `mammoth.convertToHtml()` and `.md` strings via `marked.parse()`.

3. **TipTap Editor Toolbar Integration**:
   - AI generated the button click handlers for `@tiptap/react` commands (`editor.chain().focus().toggleBold().run()`), reducing manual documentation lookups.

4. **Automated Unit Testing**:
   - AI generated edge-case tests in `src/__tests__/permission.test.ts` to verify `OWNER`, `EDITOR`, `VIEWER`, and uninvited access boundaries.

---

## 3. AI-Generated Output Changed or Rejected

| Output Category | Initial AI Output | Human Correction & Refactoring Rationale |
| :--- | :--- | :--- |
| **Authentication Flow** | AI initially suggested setting up NextAuth.js / Auth0 with OAuth providers. | **Rejected**. NextAuth would have forced reviewers to setup API secrets or register real OAuth redirect URIs. Replaced with an **Instant User Switcher** storing session ID in request headers (`x-user-id`) for 1-click reviewer testing. |
| **Prisma Package Versioning** | AI generated commands pointing to unreleased Prisma v8 packages. | **Corrected**. Pinned Prisma to stable `v5.10.0` and wrote standard CommonJS seed scripts (`prisma/seed.js`) to prevent CLI syntax errors during reviewer setup. |
| **TipTap Heading Configuration** | AI enabled default TipTap starter kit headings alongside custom heading extensions. | **Corrected**. StarterKit heading conflicted with custom level configurations (`H1`, `H2`, `H3`), causing duplicate DOM tags. Explicitly passed `heading: false` to `StarterKit.configure()`. |
| **PostCSS Configuration** | AI generated Tailwind v4 `@tailwindcss/postcss` config. | **Corrected**. Next 14 environment expected standard `tailwindcss` and `autoprefixer` PostCSS plugins to compile without build warnings. |

---

## 4. Manual Verification Protocol & Engineering Discipline

Rather than relying on self-reported AI assertions, I performed rigorous hands-on spot-checks to empirically verify every system capability:

1. **Persistence & Refresh Verification**:
   - **Action**: Manually edited document text and title as Alex Rivera, waited for the `Saved to cloud` indicator, and triggered a hard browser refresh (`Ctrl+R`).
   - **Finding**: Verified that `GET /api/documents` fetched saved HTML from SQLite (`dev.db`) and TipTap re-hydrated all formatting (H1/H2/H3, bold, lists) without content loss.

2. **Viewer Permission & 403 Security Verification**:
   - **Action**: Switched active session to **Devin Miller** (Viewer), navigated to the **Shared With Me** tab, opened the shared document, and attempted to type edits.
   - **Finding**: Confirmed the UI toolbar locked with the amber `Read-Only Mode` banner. Sent a direct `PUT` API mutation to `/api/documents/doc_product_roadmap` with Devin's header and confirmed the server genuinely rejected the request with `HTTP 403 Forbidden: Permission denied: Viewers cannot edit document content`.

3. **Real File Import Verification**:
   - **Action**: Dragged real `.txt` and `.md` files into the **Import** modal.
   - **Finding**: Confirmed the backend `parseUploadedFile()` function correctly converted Markdown headers (`#`) and bullet points into editable rich HTML paragraphs in TipTap.

4. **Independent Automated Test Execution**:
   - **Action**: Executed `npx --package=vitest vitest run` directly in the terminal shell.
   - **Finding**: Watched all 7 unit/integration tests pass live in 703ms (`permission.test.ts` 4/4 passed, `fileParser.test.ts` 3/3 passed).

5. **Production Build Compilation**:
   - **Action**: Executed `npm run build`.
   - **Finding**: Enforced zero TypeScript compilation errors and verified static page generation across all 8 routes (`/`, `/_not-found`, `/api/documents`, `/api/documents/[id]`, `/api/share`, `/api/upload`, `/api/users`, `/api/history/[id]`).
