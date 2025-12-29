/**
 * Environment variable validation
 * Validates required environment variables at startup
 */

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  OPENAI_API_KEY?: string
  GEMINI_API_KEY?: string
}

function validateEnv(): EnvConfig {
  const missing: string[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  if (!supabaseUrl) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseKey) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  // At least one AI provider should be configured
  if (!openaiKey && !geminiKey) {
    missing.push('OPENAI_API_KEY or GEMINI_API_KEY (at least one required)')
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }

  // Validate URL format
  if (supabaseUrl && !supabaseUrl.startsWith('http')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP/HTTPS URL')
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey!,
    OPENAI_API_KEY: openaiKey,
    GEMINI_API_KEY: geminiKey,
  }
}

// Validate on module load (server-side only)
let envConfig: EnvConfig | null = null

export function getEnv(): EnvConfig {
  if (!envConfig) {
    // Only validate on server-side
    if (typeof window === 'undefined') {
      envConfig = validateEnv()
    } else {
      // Client-side: return what we have (validation happens server-side)
      envConfig = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      }
    }
  }
  return envConfig
}

// Export validated config
export const env = getEnv()

