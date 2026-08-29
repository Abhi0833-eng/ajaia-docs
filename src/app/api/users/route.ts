import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SEEDED_USERS } from '@/lib/memoryDb';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ users: users.length > 0 ? users : SEEDED_USERS });
  } catch (error) {
    console.warn('Prisma query in Vercel serverless failed, returning seeded users fallback:', error);
    return NextResponse.json({ users: SEEDED_USERS });
  }
}
