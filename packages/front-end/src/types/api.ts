export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiListSuccess<T> extends ApiSuccess<T[]> {
  total: number;
}

export interface ApiFieldErrors {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}

export interface ApiFailure {
  success: false;
  error?: string | ApiFieldErrors;
}
