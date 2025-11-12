import { z } from 'zod';

export const pointSchema = z.object({
  address: z.string(),
  coords: z.tuple([z.number(), z.number()]).nullable(),
});

export const routeInfoSchema = z
  .object({
    distance: z.string(),
    time: z.string(),
  })
  .nullable();

export const suggestionSchema = z.object({
  value: z.string(),
  displayName: z.string(),
});

export const mapStateSchema = z.object({
  activePoint: z.enum(['from', 'to']),
  from: pointSchema,
  to: pointSchema,
  routeInfo: routeInfoSchema,
  suggestions: z.array(suggestionSchema),
  suggestVisible: z.boolean(),
  sheetExpanded: z.boolean(),
});

export type Point = z.infer<typeof pointSchema>;
export type RouteInfo = z.infer<typeof routeInfoSchema>;
export type Suggestion = z.infer<typeof suggestionSchema>;
export type MapState = z.infer<typeof mapStateSchema>;
export type ActivePoint = MapState['activePoint'];