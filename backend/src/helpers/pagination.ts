import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  [key: string]: unknown;
}

export function getPagination(
  req: Request,
  defaultLimit?: number,
  maxLimit = 100000
): PaginationParams | undefined {
  // If explicitly requested all items or if limit is 0 / 'all'
  if (req.query.all === 'true' || req.query.limit === 'all' || req.query.limit === '0') {
    return undefined;
  }

  // If neither page nor limit are specified in the query, return undefined to fetch all records
  if (req.query.page === undefined && req.query.limit === undefined && defaultLimit === undefined) {
    return undefined;
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const rawLimit = parseInt(req.query.limit as string);
  const limit = Math.min(maxLimit, Math.max(1, isNaN(rawLimit) ? (defaultLimit || 50) : rawLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function getPaginationMeta(
  total: number,
  params?: PaginationParams
): PaginationMeta {
  if (!params) {
    return {
      page: 1,
      limit: total,
      total,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  }

  const totalPages = Math.ceil(total / params.limit);

  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  };
}

