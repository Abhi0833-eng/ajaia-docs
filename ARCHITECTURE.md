# 🏗️ Architecture & Technical Decision Note - Ajaia Docs

Candidate: **Abhishek Gupta** ([abhishekgupta0834@gmail.com](mailto:abhishekgupta0834@gmail.com))

---

## 1. Architectural Philosophy & Principles

When building **Ajaia Docs** under tight time constraints (4-6 hours), the primary architectural goal was to maximize **product fidelity and security correctness** without over-engineering infrastructure.

### Core Tradeoff Principles:
1. **Pragmatic Persistence over Complex Cloud DB Setup**: Selected **SQLite + Prisma ORM** instead of PostgreSQL or Supabase. SQLite requires zero cloud credentials or database connection strings for reviewers to configure, while providing full ACID transaction guarantees and relational key enforcement (`User`, `Document`, `Share`, `History`).
2. **Standard Rich Text Model over WebSockets / Yjs CRDTs**: Recreating full Yjs/CRDT real-time multi-cursor collaboration within 6 hours risks shallow bugs and incomplete UI flows. Instead, prioritized **TipTap / ProseMirror rich text formatting**, automatic debounced cloud persistence, and strict server-side permission controls.
3. **Frictionless Reviewer Auth Simulation**: Implemented an explicit header-level User Switcher (`Alex - Owner`, `Sarah - Editor`, `Devin - Viewer`) backed by session headers (`x-user-id`) instead of requiring reviewers to manually create 3 separate email accounts and verify OTP tokens.

---

## 2. System Architecture & Component Surfaces

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js App Router (Client)                      │
│                                                                        │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   Header     │  │  Sidebar Navigation│ │ TipTap / ProseMirror     │  │
│  │ User Switcher│  │ My Docs / Shared │ │ Canvas & Format Toolbar  │  │
│  └──────┬───────┘  └────────┬─────────┘  └────────────┬─────────────┘  │
└─────────┼───────────────────┼─────────────────────────┼────────────────┘
          │                   │                         │
          ▼                   ▼                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js API Routes (Server)                      │
│                                                                        │
│  GET/POST /api/documents     GET/PUT/DELETE /api/documents/[id]        │
│  POST/DELETE /api/share      POST /api/upload  (Mammoth / Marked)      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SQLite Database (Prisma ORM)                     │
│                                                                        │
│  [User] ──< [OwnedDocuments]     [Document] ──< [Shares] (VIEWER/EDITOR)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema Design (Prisma)

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  name      String
  avatar    String?
  documents Document[] @relation("OwnedDocuments")
  shares    Share[]
  createdAt DateTime   @default(now())
}

model Document {
  id        String    @id @default(uuid())
  title     String    @default("Untitled Document")
  content   String    // Rich HTML representation
  ownerId   String
  owner     User      @relation("OwnedDocuments", fields: [ownerId], references: [id], onDelete: Cascade)
  shares    Share[]
  histories History[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Share {
  id         String   @id @default(uuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role       String   @default("VIEWER") // VIEWER | EDITOR
  createdAt  DateTime @default(now())

  @@unique([documentId, userId])
}

model History {
  id         String   @id @default(uuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  content    String
  title      String
  savedAt    DateTime @default(now())
}
```

---

## 4. Permission Model & Security Rules

All document mutations pass through server-side permission checks in API routes:

| User Role | Can View Document? | Can Edit Title/Content? | Can Invite Collaborators? | Can Delete Document? |
| :--- | :---: | :---: | :---: | :---: |
| **Document Owner** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Shared Editor** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Shared Viewer** | ✅ Yes | ❌ No (HTTP 403) | ❌ No | ❌ No |
| **Uninvited User** | ❌ No (HTTP 403) | ❌ No (HTTP 403) | ❌ No | ❌ No |

### API Enforcement Code (`src/app/api/documents/[id]/route.ts`):
```typescript
if (currentUserRole === 'VIEWER') {
  return NextResponse.json(
    { error: 'Permission denied: Viewers cannot edit document content.' },
    { status: 403 }
  );
}
```

---

## 5. Prioritization & Scope Cuts

### What Was Prioritized:
- **Rich Text Experience**: High-quality TipTap integration supporting Headings (H1-H3), Bold, Italic, Underline, Bulleted & Numbered lists, Blockquotes, Alignment, Undo/Redo.
- **Intelligent File Import**: Direct parsing of `.txt`, `.md`, and `.docx` files via `marked` and `mammoth`.
- **Instant Testability**: User Switcher dropdown pre-seeded with 3 test accounts so reviewers can test permissions in under 10 seconds.
- **Automated Verification**: Vitest unit test suite covering file parsing and security boundaries.

### What Was Intentionally Deprioritized:
- **WebSocket Real-time Cursors**: Avoided complex socket server state synchronization within timebox.
- **Enterprise Auth / OAuth Providers**: Used mocked session headers (`x-user-id`) to eliminate sign-up friction for reviewers.
- **Full Commenting Threads**: Focused on rich text, version history, and document sharing instead.
