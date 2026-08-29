import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SEEDED_USERS = [
  {
    id: 'usr_alex_01',
    name: 'Alex Rivera',
    email: 'alex@ajaia.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr_sarah_02',
    name: 'Sarah Chen',
    email: 'sarah@ajaia.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'usr_devin_03',
    name: 'Devin Miller',
    email: 'devin@ajaia.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

export async function GET() {
  try {
    let users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    if (users.length === 0) {
      try {
        await prisma.user.createMany({ data: SEEDED_USERS });
        users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
      } catch (seedErr) {
        console.warn('SQLite seed in Vercel serverless failed, returning fallback users:', seedErr);
        users = SEEDED_USERS;
      }
    }

    return NextResponse.json({ users: users.length > 0 ? users : SEEDED_USERS });
  } catch (error) {
    console.error('Error fetching users, returning fallback users:', error);
    return NextResponse.json({ users: SEEDED_USERS });
  }
}
