import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing tables
  await prisma.history.deleteMany();
  await prisma.share.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();

  // Create Seeded Users
  const alex = await prisma.user.create({
    data: {
      id: 'usr_alex_01',
      name: 'Alex Rivera',
      email: 'alex@ajaia.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      id: 'usr_sarah_02',
      name: 'Sarah Chen',
      email: 'sarah@ajaia.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const devin = await prisma.user.create({
    data: {
      id: 'usr_devin_03',
      name: 'Devin Miller',
      email: 'devin@ajaia.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  console.log('✅ Created Seed Users:', alex.name, sarah.name, devin.name);

  // Create Primary Document owned by Alex
  const doc1 = await prisma.document.create({
    data: {
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
      ownerId: alex.id,
    },
  });

  // Create Second Document owned by Alex
  const doc2 = await prisma.document.create({
    data: {
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
      ownerId: alex.id,
    },
  });

  // Create Document owned by Sarah
  const doc3 = await prisma.document.create({
    data: {
      id: 'doc_design_system',
      title: 'Ajaia UI Design System & Component Library',
      content: `
        <h1>Ajaia UI Design System</h1>
        <p>Crafted with modern Tailwind CSS, dark glassmorphism, and accessible typography.</p>
        <p>Primary color palette: Indigo/Violet gradient with sleek slate surface backgrounds.</p>
      `,
      ownerId: sarah.id,
    },
  });

  // Share doc1 with Sarah (EDITOR) and Devin (VIEWER)
  await prisma.share.create({
    data: {
      documentId: doc1.id,
      userId: sarah.id,
      role: 'EDITOR',
    },
  });

  await prisma.share.create({
    data: {
      documentId: doc1.id,
      userId: devin.id,
      role: 'VIEWER',
    },
  });

  // Share doc3 with Alex (EDITOR)
  await prisma.share.create({
    data: {
      documentId: doc3.id,
      userId: alex.id,
      role: 'EDITOR',
    },
  });

  // Initial history record for doc1
  await prisma.history.create({
    data: {
      documentId: doc1.id,
      title: doc1.title,
      content: doc1.content,
    },
  });

  console.log('✅ Created Sample Documents and Access Grants');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
