import { z } from 'zod';

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens and underscores');

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: usernameSchema,
});

// Profile validation
export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  title: z.string().max(100).optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  isPublic: z.boolean().optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

// Card content schemas per type
const socialContentSchema = z.object({
  platform: z.string(),
  username: z.string(),
  url: z.string().url(),
  followers: z.string().optional(),
  icon: z.string(),
});

const mediaContentSchema = z.object({
  type: z.enum(['image', 'video', 'gif']),
  url: z.string(),
  alt: z.string().optional(),
  overlayText: z.string().optional(),
  objectPosition: z.object({ x: z.number(), y: z.number() }).optional(),
  objectScale: z.number().optional(),
});

const mapContentSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  zoom: z.number(),
  style: z.enum(['light', 'dark', 'satellite']).optional(),
});

const githubContentSchema = z.object({
  username: z.string(),
  showContributions: z.boolean(),
  stats: z
    .object({
      repos: z.number(),
      followers: z.number(),
      contributions: z.number(),
    })
    .optional(),
});

const textContentSchema = z.object({
  title: z.string().optional(),
  body: z.string(),
  markdown: z.boolean().optional(),
});

const linkContentSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  favicon: z.string().optional(),
  image: z.string().optional(),
});

const titleContentSchema = z.object({
  text: z.string(),
});

const profileContentSchema = z.object({
  avatar: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  tags: z.array(z.string()),
});

const cardContentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('social'), data: socialContentSchema }),
  z.object({ type: z.literal('media'), data: mediaContentSchema }),
  z.object({ type: z.literal('map'), data: mapContentSchema }),
  z.object({ type: z.literal('github'), data: githubContentSchema }),
  z.object({ type: z.literal('text'), data: textContentSchema }),
  z.object({ type: z.literal('link'), data: linkContentSchema }),
  z.object({ type: z.literal('title'), data: titleContentSchema }),
  z.object({ type: z.literal('profile'), data: profileContentSchema }),
]);

const cardStyleSchema = z
  .object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    overlay: z
      .object({
        type: z.enum(['gradient', 'solid', 'none']),
        color: z.string().optional(),
        opacity: z.number().optional(),
        direction: z.string().optional(),
      })
      .optional(),
    blur: z.boolean().optional(),
    brightness: z.number().optional(),
    contrast: z.number().optional(),
    saturation: z.number().optional(),
  })
  .optional()
  .nullable();

// Card validation
export const cardCreateSchema = z.object({
  type: z.enum(['profile', 'social', 'media', 'map', 'github', 'text', 'link', 'title']),
  positionX: z.number().int().min(0).default(0),
  positionY: z.number().int().min(0).default(0),
  sizeWidth: z.number().int().min(1).max(4).default(1),
  sizeHeight: z.number().int().min(1).max(2).default(1),
  content: cardContentSchema,
  style: cardStyleSchema,
  zIndex: z.number().int().default(0),
  sortOrder: z.number().int().default(0),
});

export const cardUpdateSchema = z.object({
  positionX: z.number().int().min(0).optional(),
  positionY: z.number().int().min(0).optional(),
  sizeWidth: z.number().int().min(1).max(4).optional(),
  sizeHeight: z.number().int().min(1).max(2).optional(),
  content: cardContentSchema.optional(),
  style: cardStyleSchema,
  zIndex: z.number().int().optional(),
  sortOrder: z.number().int().optional(),
});

export const reorderSchema = z.array(
  z.object({
    id: z.string(),
    sortOrder: z.number().int(),
  })
);

// Export/Import schema
export const importSchema = z.object({
  profile: profileUpdateSchema,
  cards: z.array(cardCreateSchema),
});
