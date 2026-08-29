import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    // Auto-seed if empty
    if (users.length === 0) {
      await prisma.user.createMany({
        data: [
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
        ],
      });

      users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
