import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              fontSize: 48,
              fontWeight: 700,
              color: '#1a1a1a',
            }}
          >
            Profile not found
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const profile = user.profile;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt=""
              width={120}
              height={120}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            />
          )}
          <div
            style={{
              marginTop: 24,
              fontSize: 48,
              fontWeight: 700,
              color: '#1a1a1a',
            }}
          >
            {profile.displayName}
          </div>
          {profile.title && (
            <div
              style={{
                marginTop: 8,
                fontSize: 24,
                color: '#6b7280',
              }}
            >
              {profile.title}
            </div>
          )}
          <div
            style={{
              marginTop: 32,
              fontSize: 18,
              color: '#9ca3af',
            }}
          >
            openbento.me/{params.username}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            fontSize: 36,
            color: '#6b7280',
          }}
        >
          Open Bento
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
