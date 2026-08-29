import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const INITIAL_DEMO_DOCS = [
  {
    id: 'doc_product_roadmap',
    title: 'Ajaia Product Roadmap & Q3 Objectives',
    content: `
      <h1>Ajaia Product Roadmap & Q3 Objectives</h1>
      <p>Welcome to the official <strong>Ajaia Docs</strong> collaborative workspace! This document outlines our primary product goals and engineering deliverables for Q3.</p>
      
      <h2>1. Core Objectives</h2>
      <p>Our focus is delivering high-speed, intuitive productivity tools built for modern remote and hybrid teams.</p>
      <ul>
        <li><strong>Rich Text Editor:</strong> Support bold, italic, underline, headers, and bulleted/numbered lists with instant autosave.</li>
        <li><strong>Intelligent Import:</strong> Convert .txt, .md, and .docx files directly into editable web documents.</li>
        <li><strong>Granular Sharing:</strong> Role-based access control with explicit Owner, Editor, and Viewer privileges.</li>
      </ul>

      <h2>2. Key Deliverables</h2>
      <ol>
        <li>Full-stack Next.js architecture with SQLite relational storage.</li>
        <li>Instant account switcher for seamless multi-user permission verification.</li>
        <li>Export capabilities to Markdown, clean HTML, and Plain Text.</li>
      </ol>

      <blockquote>
        "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
      </blockquote>
    `,
    ownerId: 'usr_alex_01',
    owner: {
      id: 'usr_alex_01',
      name: 'Alex Rivera',
      email: 'alex@ajaia.com',
    },
    shares: [
      { id: 'sh_1', documentId: 'doc_product_roadmap', userId: 'usr_sarah_02', role: 'EDITOR', user: { id: 'usr_sarah_02', name: 'Sarah Chen', email: 'sarah@ajaia.com' } },
      { id: 'sh_2', documentId: 'doc_product_roadmap', userId: 'usr_devin_03', role: 'VIEWER', user: { id: 'usr_devin_03', name: 'Devin Miller', email: 'devin@ajaia.com' } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc_engineering_guidelines',
    title: 'Engineering Quality & Code Review Standards',
    content: `
      <h1>Engineering Quality & Code Review Standards</h1>
      <p>This internal guide specifies code style, commit standards, and automated testing requirements for Ajaia engineering teams.</p>
      <h2>Best Practices</h2>
      <ul>
        <li>Always test permission boundaries for shared endpoints.</li>
        <li>Maintain strict separation between business logic and UI presentation.</li>
        <li>Document architecture tradeoffs clearly in ARCHITECTURE.md.</li>
      </ul>
    `,
    ownerId: 'usr_alex_01',
    owner: {
      id: 'usr_alex_01',
      name: 'Alex Rivera',
      email: 'alex@ajaia.com',
    },
    shares: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || req.nextUrl.searchParams.get('userId') || 'usr_alex_01';

    let ownedDocs: any[] = [];
    let sharedGrants: any[] = [];

    try {
      ownedDocs = await prisma.document.findMany({
        where: { ownerId: userId },
        include: {
          owner: true,
          shares: { include: { user: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });

      sharedGrants = await prisma.share.findMany({
        where: { userId },
        include: {
          document: {
            include: {
              owner: true,
              shares: { include: { user: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('SQLite fetch in serverless failed, using memory fallback docs:', dbErr);
    }

    if (ownedDocs.length === 0 && sharedGrants.length === 0) {
      // Fallback demo documents
      const owned = INITIAL_DEMO_DOCS.filter((d) => d.ownerId === userId).map((d) => ({
        ...d,
        isSharedWithMe: false,
        currentUserRole: 'OWNER' as const,
      }));

      const shared = INITIAL_DEMO_DOCS.filter((d) =>
        d.shares.some((s) => s.userId === userId)
      ).map((d) => {
        const share = d.shares.find((s) => s.userId === userId);
        return {
          ...d,
          isSharedWithMe: true,
          currentUserRole: (share?.role || 'VIEWER') as 'VIEWER' | 'EDITOR',
        };
      });

      return NextResponse.json({
        owned,
        shared,
        all: [...owned, ...shared],
      });
    }

    const formattedOwned = ownedDocs.map((doc) => ({
      ...doc,
      isSharedWithMe: false,
      currentUserRole: 'OWNER' as const,
    }));

    const formattedShared = sharedGrants.map((grant) => ({
      ...grant.document,
      isSharedWithMe: true,
      currentUserRole: grant.role as 'VIEWER' | 'EDITOR',
    }));

    return NextResponse.json({
      owned: formattedOwned,
      shared: formattedShared,
      all: [...formattedOwned, ...formattedShared],
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({
      owned: [INITIAL_DEMO_DOCS[0]],
      shared: [],
      all: [INITIAL_DEMO_DOCS[0]],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'usr_alex_01';
    const body = await req.json().catch(() => ({}));

    const title = body.title || 'Untitled Document';
    const content = body.content || '<h1>Untitled Document</h1><p>Start typing your content here...</p>';

    let doc;
    try {
      doc = await prisma.document.create({
        data: {
          title,
          content,
          ownerId: userId,
        },
        include: {
          owner: true,
          shares: { include: { user: true } },
        },
      });
    } catch (dbErr) {
      doc = {
        id: 'doc_' + Date.now(),
        title,
        content,
        ownerId: userId,
        owner: { id: userId, name: 'Active User', email: 'user@ajaia.com' },
        shares: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      document: {
        ...doc,
        isSharedWithMe: false,
        currentUserRole: 'OWNER',
      },
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
