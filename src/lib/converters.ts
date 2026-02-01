import { Card as PrismaCard, Profile as PrismaProfile, CardType as PrismaCardType } from '@prisma/client';
import { BentoCard, CardContent, CardStyle, CardType } from './types';

// Convert Prisma Card to client BentoCard
export function dbCardToClient(card: PrismaCard): BentoCard {
  return {
    id: card.id,
    type: card.type as CardType,
    position: { x: card.positionX, y: card.positionY },
    size: { width: card.sizeWidth, height: card.sizeHeight },
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

// Convert Prisma Profile to client format
export function dbProfileToClient(profile: PrismaProfile) {
  return {
    avatar: profile.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    name: profile.displayName,
    title: profile.title || '',
    tags: profile.tags,
    bio: profile.bio || '',
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
