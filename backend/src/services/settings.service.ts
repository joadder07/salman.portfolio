import prisma from '../config/db';
import type { UpdateSettingsInput } from '../validators/settings.validator';

const SINGLETON_ID = 'singleton';

/** Parse JSON string fields back to objects for API response */
function parseSettings(settings: any) {
  return {
    ...settings,
    socialLinks: settings.socialLinks
      ? JSON.parse(settings.socialLinks)
      : null,
    musicPlaylist: settings.musicPlaylist
      ? JSON.parse(settings.musicPlaylist)
      : null,
    heroImages: settings.heroImages
      ? JSON.parse(settings.heroImages)
      : null,
  };
}

export class SettingsService {
  /** Get current site settings (public) */
  static async get() {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: SINGLETON_ID },
    });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: SINGLETON_ID },
      });
    }

    // Get admin public profile details (name, bio, profilePic)
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { name: true, bio: true, profilePic: true },
    });

    return {
      ...parseSettings(settings),
      adminProfilePic: admin?.profilePic || null,
      adminName: admin?.name || null,
      adminBio: admin?.bio || null,
    };
  }

  /** Update site settings (admin) */
  static async update(data: UpdateSettingsInput) {
    // Stringify JSON fields for SQLite storage
    const payload: any = { ...data };
    if (payload.socialLinks !== undefined) {
      if (typeof payload.socialLinks === 'object' && payload.socialLinks !== null) {
        if (payload.socialLinks.facebook !== undefined) payload.facebookUrl = payload.socialLinks.facebook;
        if (payload.socialLinks.instagram !== undefined) payload.instagramUrl = payload.socialLinks.instagram;
      }
      payload.socialLinks = JSON.stringify(payload.socialLinks);
    }
    if (payload.musicPlaylist !== undefined) {
      payload.musicPlaylist = JSON.stringify(payload.musicPlaylist);
    }
    if (payload.heroImages !== undefined) {
      payload.heroImages = JSON.stringify(payload.heroImages);
    }
    if (payload.heroBackgroundImage === '') {
      payload.heroBackgroundImage = null;
    }
    if (payload.bannerImage === '') {
      payload.bannerImage = null;
    }
    if (payload.bannerQuote === '') {
      payload.bannerQuote = null;
    }
    if (payload.bannerQuoteSubtext === '') {
      payload.bannerQuoteSubtext = null;
    }

    const result = await prisma.siteSettings.upsert({
      where: { id: SINGLETON_ID },
      update: payload,
      create: { id: SINGLETON_ID, ...payload },
    });

    return parseSettings(result);
  }
}
