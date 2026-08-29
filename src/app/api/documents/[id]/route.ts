import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id') || req.nextUrl.searchParams.get('userId') || 'usr_alex_01';

    const doc = await prisma.document.findUnique({
      where: { id },
      include: {
        owner: true,
        shares: { include: { user: true } },
        histories: { orderBy: { savedAt: 'desc' }, take: 10 },
      },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Permission check
    let currentUserRole: 'OWNER' | 'EDITOR' | 'VIEWER' | null = null;
    if (doc.ownerId === userId) {
      currentUserRole = 'OWNER';
    } else {
      const share = doc.shares.find((s) => s.userId === userId);
      if (share) {
        currentUserRole = share.role as 'EDITOR' | 'VIEWER';
      }
    }

    if (!currentUserRole) {
      return NextResponse.json({ error: 'Access denied to this document' }, { status: 403 });
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

    const doc = await prisma.document.findUnique({
      where: { id },
      include: { shares: true },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Role verification
    let currentUserRole: 'OWNER' | 'EDITOR' | 'VIEWER' | null = null;
    if (doc.ownerId === userId) {
      currentUserRole = 'OWNER';
    } else {
      const share = doc.shares.find((s) => s.userId === userId);
      if (share) {
        currentUserRole = share.role as 'EDITOR' | 'VIEWER';
      }
    }

    if (!currentUserRole) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (currentUserRole === 'VIEWER') {
      return NextResponse.json(
        { error: 'Permission denied: Viewers cannot edit document content.' },
        { status: 403 }
      );
    }

    const title = body.title !== undefined ? body.title : doc.title;
    const content = body.content !== undefined ? body.content : doc.content;

    const updatedDoc = await prisma.document.update({
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

    // Save history snapshot if content changed significantly
    if (body.saveHistory || Math.abs(content.length - doc.content.length) > 50) {
      await prisma.history.create({
        data: {
          documentId: id,
          title,
          content,
        },
      });
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

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (doc.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Only the document owner can delete this document.' },
        { status: 403 }
      );
    }

    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
