import { NextRequest, NextResponse } from 'next/server';
import { parseUploadedFile } from '@/lib/fileParser';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'usr_alex_01';
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as string) || 'new_doc'; // 'new_doc' | 'import_content'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const parseResult = await parseUploadedFile(fileBuffer, file.name);

    if (mode === 'import_content') {
      return NextResponse.json({
        parsed: parseResult,
        message: `Successfully extracted content from ${file.name}`,
      });
    }

    // Create a new document in DB
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ error: 'No valid user found' }, { status: 400 });
      }
    }

    const newDoc = await prisma.document.create({
      data: {
        title: parseResult.title,
        content: parseResult.html,
        ownerId: user.id,
      },
      include: {
        owner: true,
        shares: { include: { user: true } },
      },
    });

    return NextResponse.json({
      document: {
        ...newDoc,
        isSharedWithMe: false,
        currentUserRole: 'OWNER',
      },
      parsed: parseResult,
      message: `Created document "${parseResult.title}" from ${file.name}`,
    });
  } catch (error: any) {
    console.error('Error uploading/parsing file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process uploaded file' },
      { status: 500 }
    );
  }
}
