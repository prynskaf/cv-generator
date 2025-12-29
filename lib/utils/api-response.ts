import { NextResponse } from 'next/server'

/**
 * Standardized API response utilities
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      ...(data !== undefined && { data }),
      ...(message && { message }),
    },
    { status }
  )
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  code?: string
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      error,
      ...(code && { code }),
    },
    { status }
  )
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(
  error: string
): NextResponse<ApiErrorResponse> {
  return errorResponse(error, 400, 'VALIDATION_ERROR')
}

/**
 * Create an authentication error response
 */
export function authErrorResponse(
  error: string = 'Unauthorized'
): NextResponse<ApiErrorResponse> {
  return errorResponse(error, 401, 'AUTH_ERROR')
}

/**
 * Create a not found error response
 */
export function notFoundResponse(
  error: string = 'Resource not found'
): NextResponse<ApiErrorResponse> {
  return errorResponse(error, 404, 'NOT_FOUND')
}

