
export interface ApiSuccess<T> {
  readonly ok: true;
  readonly data: T;
}

export interface ApiError {
  readonly ok: false;
  readonly error: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;

export function isOk<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok === true;
}

export function isErr<T>(result: ApiResult<T>): result is ApiError {
  return result.ok === false;
}
