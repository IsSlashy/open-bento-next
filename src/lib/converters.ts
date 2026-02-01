import { Card as PrismaCard, Profile as PrismaProfile, CardType as PrismaCardType } from '@prisma/client';
import { BentoCard, CardContent, CardStyle, CardType } from './types';

// Max data-URL length we allow through (~500 KB base64 ≈ ~375 KB binary).
// Anything larger was likely a video/file stored inline by mistake and will
// crash serialisation or the browser.  Strip the URL so the card renders as
// a broken placeholder the user can delete.
const MAX_DATA_URL_LENGTH = 6_000_000; // ~4.5 MB binary (base64 overhead)

// Convert Prisma Card to client BentoCard
// Migration from 4-col to 8-col is handled by the store's hydrate function.
export function dbCardToClient(card: PrismaCard): BentoCard {
  let content = card.content as unknown as CardContent;

  // Guard against oversized inline data-URLs (e.g. videos stored as base64)
  if (content?.type === 'media') {
    const data = (content as unknown as { type: 'media'; data: { url?: string; type?: string } }).data;
    if (data?.url && data.url.startsWith('data:') && data.url.length > MAX_DATA_URL_LENGTH) {
      content = {
        ...content,
        data: { ...data, url: '' },
      } as CardContent;
    }
  }

  return {
    id: card.id,
    type: card.type as CardType,
    position: { x: card.positionX, y: card.positionY },
    size: { width: card.sizeWidth, height: card.sizeHeight },
    content,
    style: card.style as unknown as CardStyle | undefined,
    zIndex: card.zIndex,
  };
}

// Convert client BentoCard to DB create/update data
export function clientCardToDb(
  card: Omit<BentoCard, 'id'> & { id?: string },
  profileId: string,
  sortOrder: number
) {
  return {
    profileId,
    type: card.type as PrismaCardType,
    positionX: card.position.x,
    positionY: card.position.y,
    sizeWidth: card.size.width,
    sizeHeight: card.size.height,
    content: card.content as object,
    style: (card.style as object) ?? undefined,
    zIndex: card.zIndex ?? 0,
    sortOrder,
  };
}

// Old defaults to strip for existing users
const OLD_DEFAULT_TITLE = 'Your Title | Your Role';
const OLD_DEFAULT_BIO = 'Write something about yourself...';
const OLD_DEFAULT_TAGS = ['Tag 1', 'Tag 2', 'Tag 3'];

// Convert Prisma Profile to client format
export function dbProfileToClient(profile: PrismaProfile) {
  // Strip old default values so placeholders show instead
  const title = profile.title === OLD_DEFAULT_TITLE ? '' : (profile.title || '');
  const bio = profile.bio === OLD_DEFAULT_BIO ? '' : (profile.bio || '');
  const tagsAreOldDefault = profile.tags.length === OLD_DEFAULT_TAGS.length &&
    profile.tags.every((t, i) => t === OLD_DEFAULT_TAGS[i]);
  const tags = tagsAreOldDefault ? ['', '', ''] : profile.tags;

  return {
    avatar: profile.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    name: profile.displayName,
    title,
    tags,
    bio,
  };
}

// Convert client profile to DB update
export function clientProfileToDb(profile: {
  avatar?: string;
  name?: string;
  title?: string;
  tags?: string[];
  bio?: string;
}) {
  const data: Record<string, unknown> = {};
  if (profile.avatar !== undefined) data.avatarUrl = profile.avatar;
  if (profile.name !== undefined) data.displayName = profile.name;
  if (profile.title !== undefined) data.title = profile.title;
  if (profile.tags !== undefined) data.tags = profile.tags;
  if (profile.bio !== undefined) data.bio = profile.bio;
  return data;
}
