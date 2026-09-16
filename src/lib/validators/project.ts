import { z } from 'zod'

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),

  description: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional(),
})