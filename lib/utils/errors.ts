/**
 * Error handling utilities for consistent error responses
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public userMessage?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 400, userMessage || message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized', userMessage?: string) {
    super(message, 401, userMessage || 'You must be logged in to perform this action.')
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, 404, userMessage || 'The requested resource was not found.')
    this.name = 'NotFoundError'
  }
}

/**
 * Handles errors and returns user-friendly messages
 */
export function handleApiError(error: unknown): { 
  message: string
  statusCode: number
  userMessage: string
} {
  // Known application errors
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      userMessage: error.userMessage || error.message,
    }
  }

  // Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code?: string; message?: string }
    
    if (supabaseError.code === 'PGRST116') {
      return {
        message: 'Resource not found',
        statusCode: 404,
        userMessage: 'The requested resource was not found.',
      }
    }

    if (supabaseError.code === '23505') {
      return {
        message: 'Duplicate entry',
        statusCode: 409,
        userMessage: 'This record already exists.',
      }
    }

    if (supabaseError.message) {
      return {
        message: supabaseError.message,
        statusCode: 500,
        userMessage: 'A database error occurred. Please try again later.',
      }
    }
  }

  // Generic errors
  if (error instanceof Error) {
    // Don't expose internal error messages to users
    return {
      message: error.message,
      statusCode: 500,
      userMessage: 'An unexpected error occurred. Please try again later.',
    }
  }

  // Unknown errors
  return {
    message: 'Unknown error',
    statusCode: 500,
    userMessage: 'An unexpected error occurred. Please try again later.',
  }
}

