import { createCrudService } from './crud.factory';
import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import type { CreateVideoInput, UpdateVideoInput } from '../validators/video.validator';
import type { PaginationParams } from '../helpers/pagination';

const baseCrud = createCrudService<CreateVideoInput, UpdateVideoInput>('video');

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.trim().match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

function ensureYouTubeThumbnail(data: any) {
  const out = { ...data };
  if (out.videoUrl && (!out.thumbnailUrl || out.thumbnailUrl.trim() === '')) {
    const id = extractYouTubeId(out.videoUrl);
    if (id) {
      out.thumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
  }
  return out;
}

export const videoService = {
  ...baseCrud,

  /** Automatically generate and attach YouTube thumbnail if not explicitly provided */
  async create(data: CreateVideoInput) {
    return baseCrud.create(ensureYouTubeThumbnail(data));
  },

  /** Ensure YouTube thumbnail is updated when videoUrl changes */
  async update(id: string, data: UpdateVideoInput) {
    return baseCrud.update(id, ensureYouTubeThumbnail(data));
  },

  /** Override findAll to support category filtering + fallback YouTube thumbnails */
  async findAll(params?: PaginationParams, filters?: { category?: string; featured?: boolean }) {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.featured !== undefined) where.featured = filters.featured;

    const result = await baseCrud.findAll(params, where);
    return {
      items: (result.items as any[]).map(ensureYouTubeThumbnail),
      total: result.total,
    };
  },

  /** Override findById to include approved comments */
  async findByIdWithComments(id: string) {
    const item = await prisma.video.findUnique({
      where: { id },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Video');
    }

    return ensureYouTubeThumbnail(item);
  },
};
