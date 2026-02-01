import { Card as PrismaCard, Profile as PrismaProfile, CardType as PrismaCardType } from '@prisma/client';
import { BentoCard, CardContent, CardStyle, CardType } from './types';

const GRID_COLS = 8;

// Migrate a single card from old 4-col layout to 8-col layout.
// Idempotent: if the card already has values that exceed the old 4-col bounds, skip.
function migrateCardToEightCol(posX: number, posY: number, w: number, h: number) {
  if (posX + w > 4 || w > 4 || h > 2) {
    // Already migrated
    return { x: posX, y: posY, width: w, height: h };
  }
  const newW = w * 2;
  const newH = h * 2;
  let newX = posX * 2;
  // Clamp so card doesn't overflow 8 columns
  if (newX + newW > GRID_COLS) {
    newX = Math.max(0, GRID_COLS - newW);
  }
  return { x: newX, y: posY * 2, width: newW, height: newH };
}

// Convert Prisma Card to client BentoCard
export function dbCardToClient(card: PrismaCard): BentoCard {
  const migrated = migrateCardToEightCol(card.positionX, card.positionY, card.sizeWidth, card.sizeHeight);
  return {
    id: card.id,
    type: card.type as CardType,
    position: { x: migrated.x, y: migrated.y },
    size: { width: migrated.width, height: migrated.height },
    content: card.content as unknown as CardContent,
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
