import { z } from 'zod';

const envSchema = z.object({
  NOTION_TOKEN: z.string().min(1, 'NOTION_TOKEN is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
});

export type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  const result = envSchema.safeParse({
    NOTION_TOKEN: import.meta.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: import.meta.env.NOTION_DATABASE_ID,
  });

  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ).join('\n');
    
    throw new Error(`Environment validation failed:\n${errors}`);
  }

  return result.data;
}

export const config = validateEnv();