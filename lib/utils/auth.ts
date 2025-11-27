import { createClient } from '@/lib/supabase/server'
import { AuthenticationError } from './errors'
import { authErrorResponse } from './api-response'

/**
 * Get authenticated user or throw error
 */
export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new AuthenticationError('User not authenticated')
  }

  return { user, supabase }
}

/**
 * Middleware helper for API routes that require authentication
 */
export async function withAuth<T>(
  handler: (user: { id: string; email?: string }, supabase: ReturnType<typeof createClient> extends Promise<infer U> ? U : never) => Promise<T>
): Promise<T> {
  const { user, supabase } = await requireAuth()
  return handler(user, await supabase)
}

