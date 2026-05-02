import { createSelectSchema } from 'drizzle-zod'
import type z from 'zod'
import { favorites } from './favorites'
import { file } from './files'
import { trash } from './trash'

export const fileSchema = createSelectSchema(file)
export type FileSchema = z.infer<typeof fileSchema>

export const favoritesSchema = createSelectSchema(favorites)
export type FavoritesSchema = z.infer<typeof favoritesSchema>

export const trashSchema = createSelectSchema(trash)
export type TrashSchema = z.infer<typeof trashSchema>
