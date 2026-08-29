import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const requesterId = req.headers.get('x-user-id') || 'usr_alex_01';
    const body = await req.json();
    const { documentId, targetUserId, targetEmail, role } = body;

    if (!documentId || (!targetUserId && !targetEmail)) {
      return NextResponse.json(
        { error: 'Document ID and target user/email are required' },
        { status: 400 }
      );
    }

    const shareRole = role === 'EDITOR' ? 'EDITOR' : 'VIEWER';

    // Verify document exists & permissions
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { shares: true },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const isOwner = doc.ownerId === requesterId;
    const requesterShare = doc.shares.find((s) => s.userId === requesterId);

    if (!isOwner && (!requesterShare || requesterShare.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Only document owners or editors can invite collaborators.' },
        { status: 403 }
      );
    }

    // Find target user by ID or Email
    let targetUser = null;
    if (targetUserId) {
      targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    } else if (targetEmail) {
      targetUser = await prisma.user.findUnique({ where: { email: targetEmail } });
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: `User with email "${targetEmail}" was not found in seeded accounts.` },
        { status: 404 }
      );
    }

    if (targetUser.id === doc.ownerId) {
      return NextResponse.json(
        { error: 'Cannot share document with the document owner.' },
        { status: 400 }
      );
    }

    // Create or update share record
    const share = await prisma.share.upsert({
      where: {
        documentId_userId: {
          documentId,
          userId: targetUser.id,
        },
      },
      update: {
        role: shareRole,
      },
      create: {
        documentId,
        userId: targetUser.id,
        role: shareRole,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ share, message: `Access granted to ${targetUser.name} as ${shareRole}` });
  } catch (error) {
    console.error('Error granting document share:', error);
    return NextResponse.json({ error: 'Failed to update sharing access' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const requesterId = req.headers.get('x-user-id') || 'usr_alex_01';
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');
    const targetUserId = searchParams.get('userId');

    if (!documentId || !targetUserId) {
      return NextResponse.json(
        { error: 'documentId and userId are required' },
        { status: 400 }
      );
    }

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Only owner or self can revoke access
    if (doc.ownerId !== requesterId && targetUserId !== requesterId) {
      return NextResponse.json(
        { error: 'Only the document owner can revoke access.' },
        { status: 403 }
      );
    }

    await prisma.share.deleteMany({
      where: {
        documentId,
        userId: targetUserId,
      },
    });

    return NextResponse.json({ success: true, message: 'Access revoked successfully' });
  } catch (error) {
    console.error('Error revoking share access:', error);
    return NextResponse.json({ error: 'Failed to revoke sharing access' }, { status: 500 });
  }
}
