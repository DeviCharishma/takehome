import type { ApiFailure, ApiFieldErrors } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:50000';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function isFieldErrors(error: ApiFailure['error']): error is ApiFieldErrors {
  return typeof error === 'object' && error !== null;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const body: (T & { success: true }) | ApiFailure | null = await res.json().catch(() => null);

  if (!res.ok || !body || body.success === false) {
    const failure = body as ApiFailure | null;
    const message = typeof failure?.error === 'string' ? failure.error : 'Something went wrong. Please try again.';
    const fieldErrors = isFieldErrors(failure?.error) ? failure.error.fieldErrors : undefined;

    throw new ApiError(message, res.status, fieldErrors);
  }

  return body;
}
