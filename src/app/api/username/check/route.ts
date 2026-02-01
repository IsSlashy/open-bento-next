import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { usernameSchema } from '@/lib/validations';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ available: false, error: 'Username required' }, { status: 400 });
  }

  const result = usernameSchema.safeParse(username);
  if (!result.success) {
    return NextResponse.json({ available: false, error: result.error.issues[0].message }, { status: 400 });
  }

  // Reserved usernames
  const reserved = ['admin', 'api', 'auth', 'login', 'register', 'editor', 'settings', 'onboarding', 'about', 'help', 'support'];
  if (reserved.includes(username.toLowerCase())) {
    return NextResponse.json({ available: false, error: 'Username is reserved' });
  }

  const existing = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  return NextResponse.json({ available: !existing });
}
