import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || req.nextUrl.searchParams.get('userId') || 'usr_alex_01';

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Owned documents
    const ownedDocs = await prisma.document.findMany({
      where: { ownerId: userId },
      include: {
        owner: true,
        shares: { include: { user: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Shared documents
    const sharedGrants = await prisma.share.findMany({
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
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'usr_alex_01';
    const body = await req.json().catch(() => ({}));

    const title = body.title || 'Untitled Document';
    const content = body.content || '<h1>Untitled Document</h1><p>Start typing your content here...</p>';

    // Ensure user exists
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ error: 'No active user found' }, { status: 400 });
      }
    }

    const doc = await prisma.document.create({
      data: {
        title,
        content,
        ownerId: user.id,
      },
      include: {
        owner: true,
        shares: { include: { user: true } },
      },
    });

    // Initial history record
    await prisma.history.create({
      data: {
        documentId: doc.id,
        title: doc.title,
        content: doc.content,
      },
    });

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
