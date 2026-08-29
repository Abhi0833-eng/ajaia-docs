import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id: documentId } = await params;
    const histories = await prisma.history.findMany({
      where: { documentId },
      orderBy: { savedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ histories });
  } catch (error) {
    console.error('Error fetching document history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Context) {
  try {
    const { id: historyId } = await params;
    const userId = req.headers.get('x-user-id') || 'usr_alex_01';

    const historyRecord = await prisma.history.findUnique({
      where: { id: historyId },
      include: { document: { include: { shares: true } } },
    });

    if (!historyRecord) {
      return NextResponse.json({ error: 'History record not found' }, { status: 404 });
    }

    const doc = historyRecord.document;
    const isOwner = doc.ownerId === userId;
    const isEditor = doc.shares.some((s) => s.userId === userId && s.role === 'EDITOR');

    if (!isOwner && !isEditor) {
      return NextResponse.json(
        { error: 'Only owners or editors can restore document snapshots.' },
        { status: 403 }
      );
    }

    const updatedDoc = await prisma.document.update({
      where: { id: doc.id },
      data: {
        title: historyRecord.title,
        content: historyRecord.content,
      },
      include: {
        owner: true,
        shares: { include: { user: true } },
      },
    });

    return NextResponse.json({
      document: updatedDoc,
      message: 'Restored document snapshot successfully',
    });
  } catch (error) {
    console.error('Error restoring history snapshot:', error);
    return NextResponse.json({ error: 'Failed to restore history' }, { status: 500 });
  }
}
