import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';

export interface SearchFilter {
  field: string;
  value: any;
  operator?: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
}

export interface SearchSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: SearchFilter[];
  sort?: SearchSort[];
  page?: number;
  limit?: number;
  model: 'user' | 'post' | 'page' | 'product';
}

export interface SearchResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class SearchService {
  private buildWhereClause(query: string, filters: SearchFilter[], model: string) {
    const where: any = {};

    // Add full-text search condition based on model
    if (query) {
      switch (model) {
        case 'user':
          where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ];
          break;
        case 'post':
          where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ];
          break;
        case 'page':
          where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ];
          break;
        case 'product':
          where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ];
          break;
      }
    }

    // Add filter conditions
    filters.forEach((filter) => {
      const { field, value, operator = 'equals' } = filter;

      switch (operator) {
        case 'contains':
          where[field] = { contains: value, mode: 'insensitive' };
          break;
        case 'gt':
          where[field] = { gt: value };
          break;
        case 'lt':
          where[field] = { lt: value };
          break;
        case 'between':
          if (Array.isArray(value) && value.length === 2) {
            where[field] = {
              gte: value[0],
              lte: value[1],
            };
          }
          break;
        default:
          where[field] = value;
      }
    });

    return where;
  }

  private buildOrderBy(sort: SearchSort[]) {
    return sort.reduce((orderBy: any, { field, direction }) => {
      orderBy[field] = direction;
      return orderBy;
    }, {});
  }

  async search<T>({
    query = '',
    filters = [],
    sort = [],
    page = 1,
    limit = 10,
    model,
  }: SearchParams): Promise<SearchResult<T>> {
    try {
      const where = this.buildWhereClause(query, filters, model);
      const orderBy = this.buildOrderBy(sort);

      const [items, total] = await Promise.all([
        (prisma as any)[model].findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
        }),
        (prisma as any)[model].count({ where }),
      ]);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('SearchService', `Error searching ${model}`, error);
      throw error;
    }
  }

  async searchUsers(params: Omit<SearchParams, 'model'>) {
    return this.search({ ...params, model: 'user' });
  }

  async searchPosts(params: Omit<SearchParams, 'model'>) {
    return this.search({ ...params, model: 'post' });
  }

  async searchPages(params: Omit<SearchParams, 'model'>) {
    return this.search({ ...params, model: 'page' });
  }

  async searchProducts(params: Omit<SearchParams, 'model'>) {
    return this.search({ ...params, model: 'product' });
  }

  async suggest(query: string, model: string): Promise<string[]> {
    try {
      let suggestions: string[] = [];

      switch (model) {
        case 'user':
          const users = await prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 5,
            select: { name: true, email: true },
          });
          suggestions = [
            ...users.map((u) => u.name),
            ...users.map((u) => u.email),
          ];
          break;

        case 'post':
          const posts = await prisma.post.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 5,
            select: { title: true },
          });
          suggestions = posts.map((p) => p.title);
          break;

        // Add more cases for other models
      }

      return [...new Set(suggestions)]; // Remove duplicates
    } catch (error) {
      logger.error('SearchService', 'Error getting suggestions', error);
      throw error;
    }
  }

  async searchAll(query: string) {
    try {
      const [users, posts, pages, products] = await Promise.all([
        this.searchUsers({ query, limit: 3 }),
        this.searchPosts({ query, limit: 3 }),
        this.searchPages({ query, limit: 3 }),
        this.searchProducts({ query, limit: 3 }),
      ]);

      return {
        users: users.items,
        posts: posts.items,
        pages: pages.items,
        products: products.items,
      };
    } catch (error) {
      logger.error('SearchService', 'Error searching all models', error);
      throw error;
    }
  }
}

export const searchService = new SearchService();
