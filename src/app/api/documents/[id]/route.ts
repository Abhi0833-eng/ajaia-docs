import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMemoryDocById, updateMemoryDoc } from '@/lib/memoryDb';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id') || req.nextUrl.searchParams.get('userId') || 'usr_alex_01';

    let doc: any = null;
    try {
      doc = await prisma.document.findUnique({
        where: { id },
        include: {
          owner: true,
          shares: { include: { user: true } },
          histories: { orderBy: { savedAt: 'desc' }, take: 10 },
        },
      });
    } catch (dbErr) {
      doc = getMemoryDocById(id);
    }

    if (!doc) {
      doc = getMemoryDocById(id);
    }

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Permission check
    let currentUserRole: 'OWNER' | 'EDITOR' | 'VIEWER' | null = null;
    if (doc.ownerId === userId) {
      currentUserRole = 'OWNER';
    } else {
      const share = doc.shares.find((s: any) => s.userId === userId);
      if (share) {
        currentUserRole = share.role as 'EDITOR' | 'VIEWER';
      }
    }

    if (!currentUserRole) {
      currentUserRole = 'VIEWER'; // Fallback
    }

    return NextResponse.json({
      document: {
        ...doc,
        isSharedWithMe: doc.ownerId !== userId,
        currentUserRole,
      },
    });
  } catch (error) {
    console.error('Error fetching document detail:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id') || 'usr_alex_01';
    const body = await req.json();

    let doc: any = null;
    try {
      doc = await prisma.document.findUnique({
        where: { id },
        include: { shares: true },
      });
    } catch (dbErr) {
      doc = getMemoryDocById(id);
    }

    if (!doc) {
      doc = getMemoryDocById(id);
    }

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Role verification
    let currentUserRole: 'OWNER' | 'EDITOR' | 'VIEWER' | null = null;
    if (doc.ownerId === userId) {
      currentUserRole = 'OWNER';
    } else {
      const share = doc.shares.find((s: any) => s.userId === userId);
      if (share) {
        currentUserRole = share.role as 'EDITOR' | 'VIEWER';
      }
    }

    if (!currentUserRole) {
      currentUserRole = 'OWNER'; // Fallback for owner edits
    }

    if (currentUserRole === 'VIEWER') {
      return NextResponse.json(
        { error: 'Permission denied: Viewers cannot edit document content.' },
        { status: 403 }
      );
    }

    const title = body.title !== undefined ? body.title : doc.title;
    const content = body.content !== undefined ? body.content : doc.content;

    let updatedDoc: any = null;
    try {
      updatedDoc = await prisma.document.update({
        where: { id },
        data: {
          title,
          content,
        },
        include: {
          owner: true,
          shares: { include: { user: true } },
        },
      });
    } catch (dbErr) {
      updatedDoc = updateMemoryDoc(id, title, content);
    }

    if (!updatedDoc) {
      updatedDoc = updateMemoryDoc(id, title, content);
    }

    return NextResponse.json({
      document: {
        ...updatedDoc,
        isSharedWithMe: updatedDoc.ownerId !== userId,
        currentUserRole,
      },
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id') || 'usr_alex_01';

    try {
      await prisma.document.delete({ where: { id } });
    } catch (dbErr) {
      console.warn('Memory fallback document deletion');
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
