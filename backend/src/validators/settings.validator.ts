import { z } from 'zod';

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  aboutText: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  activeTheme: z.string().optional(),
  musicPlaylist: z.array(z.object({
    title: z.string(),
    artist: z.string(),
    src: z.string().url(),
  })).optional(),
  heroImages: z.array(z.object({
    id: z.union([z.number(), z.string()]).optional(),
    url: z.string().min(1),
    title: z.string().optional(),
  })).optional(),
  heroBackgroundImage: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  bannerQuote: z.string().optional().nullable(),
  bannerQuoteSubtext: z.string().optional().nullable(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
