import { z } from 'zod';

export type ClipListRequestFilters = z.infer<typeof ClipListRequestFiltersSchema>

export const ClipListRequestFiltersSchema = z.object({
  amount: z.number(),
  beforeCursor: z.string().optional(),
  afterCursor: z.string().optional(),
  isFeatured: z.boolean().optional(),
  startedAt: z.string().optional(),
  endedAt: z.string().optional()
});