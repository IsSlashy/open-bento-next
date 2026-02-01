import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createHash } from 'crypto';

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

function getDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// POST — record a page view (deduplicated by IP + profile per day)
export async function POST(req: NextRequest) {
  try {
    const { profileId } = await req.json();
    if (!profileId) {
      return NextResponse.json({ error: 'profileId required' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';
    const ipHash = hashIp(ip);
    const today = getDateOnly(new Date());

    // Check if this IP already viewed this profile today
    const existing = await prisma.pageView.findFirst({
      where: {
        profileId,
        ipHash,
        viewedAt: {
          gte: today,
          lt: new Date(today.getTime() + 86400000),
        },
      },
    });

    if (!existing) {
      await prisma.pageView.create({
        data: {
          profileId,
          ipHash,
          viewedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}

// GET — get view count for a profile
export async function GET(req: NextRequest) {
  try {
    const profileId = req.nextUrl.searchParams.get('profileId');
    if (!profileId) {
      return NextResponse.json({ error: 'profileId required' }, { status: 400 });
    }

    const total = await prisma.pageView.count({
      where: { profileId },
    });

    const yesterday = getDateOnly(new Date());
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayEnd = new Date(yesterday.getTime() + 86400000);

    const yesterdayCount = await prisma.pageView.count({
      where: {
        profileId,
        viewedAt: {
          gte: yesterday,
          lt: yesterdayEnd,
        },
      },
    });

    const todayStart = getDateOnly(new Date());
    const todayCount = await prisma.pageView.count({
      where: {
        profileId,
        viewedAt: {
          gte: todayStart,
        },
      },
    });

    return NextResponse.json({ total, yesterday: yesterdayCount, today: todayCount });
  } catch (error) {
    console.error('View fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch views' }, { status: 500 });
  }
}
