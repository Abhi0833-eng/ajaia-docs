import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addMemoryShare, removeMemoryShare, SEEDED_USERS } from '@/lib/memoryDb';

export async function POST(req: NextRequest) {
  try {
    const requesterId = req.headers.get('x-user-id') || 'usr_alex_01';
    const body = await req.json();
    const { documentId, targetUserId, targetEmail, role } = body;

    const shareRole = role === 'EDITOR' ? 'EDITOR' : 'VIEWER';
    const targetUser = SEEDED_USERS.find((u) => u.id === targetUserId || u.email === targetEmail) || SEEDED_USERS[1];

    let share: any = null;
    try {
      share = await prisma.share.upsert({
        where: {
          documentId_userId: {
            documentId,
            userId: targetUser.id,
          },
        },
        update: { role: shareRole },
        create: {
          documentId,
          userId: targetUser.id,
          role: shareRole,
        },
        include: { user: true },
      });
    } catch (dbErr) {
      share = addMemoryShare(documentId, targetUser.id, shareRole);
    }

    if (!share) {
      share = addMemoryShare(documentId, targetUser.id, shareRole);
    }

    return NextResponse.json({ share, message: `Access granted to ${targetUser.name} as ${shareRole}` });
  } catch (error) {
    console.error('Error granting document share:', error);
    return NextResponse.json({ error: 'Failed to update sharing access' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId') || '';
    const targetUserId = searchParams.get('userId') || '';

    try {
      await prisma.share.deleteMany({
        where: { documentId, userId: targetUserId },
      });
    } catch (dbErr) {
      removeMemoryShare(documentId, targetUserId);
    }

    removeMemoryShare(documentId, targetUserId);
    return NextResponse.json({ success: true, message: 'Access revoked successfully' });
  } catch (error) {
    console.error('Error revoking share access:', error);
    return NextResponse.json({ error: 'Failed to revoke sharing access' }, { status: 500 });
  }
}
