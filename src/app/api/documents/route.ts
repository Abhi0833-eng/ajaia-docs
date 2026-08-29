import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMemoryDocs, createMemoryDoc } from '@/lib/memoryDb';

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
      console.warn('Prisma DB query failed in Vercel serverless environment, using memoryDb:', dbErr);
      const allMemDocs = getMemoryDocs();

      const owned = allMemDocs.filter((d) => d.ownerId === userId).map((d) => ({
        ...d,
        isSharedWithMe: false,
        currentUserRole: 'OWNER' as const,
      }));

      const shared = allMemDocs.filter((d) =>
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
    const allMemDocs = getMemoryDocs();
    return NextResponse.json({
      owned: [allMemDocs[0]],
      shared: [],
      all: [allMemDocs[0]],
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
      doc = createMemoryDoc(title, content, userId);
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
