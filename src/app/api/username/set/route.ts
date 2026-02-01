import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { usernameSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const result = usernameSchema.safeParse(body.username);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const username = result.data.toLowerCase();

  // Check reserved
  const reserved = ['admin', 'api', 'auth', 'login', 'register', 'editor', 'settings', 'onboarding', 'about', 'help', 'support'];
  if (reserved.includes(username)) {
    return NextResponse.json({ error: 'Username is reserved' }, { status: 400 });
  }

  // Check availability
  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing && existing.id !== session.user.id) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  });

  return NextResponse.json({ username });
}
