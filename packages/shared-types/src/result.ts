// Result<T, E> — explicit success/failure without throwing.
//
// A discriminated union on `ok`: you cannot read `.value` or `.error` without
// first narrowing, so the "forgot to handle the error" path is unrepresentable.
// Use it for operations that can fail in expected ways (API calls, parsing,
// domain rules) instead of throwing and hoping callers catch.

export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

// --- Constructors ------------------------------------------------------------
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

// --- Guards (narrow the union) -----------------------------------------------
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.ok;
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => !result.ok;

// --- Combinators -------------------------------------------------------------
// Transform the success value; errors pass through untouched.
export const map = <T, E, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> =>
  result.ok ? ok(fn(result.value)) : result;

// Transform the error; success passes through untouched.
export const mapErr = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> =>
  result.ok ? result : err(fn(result.error));

// Collapse both branches into a single value (forces handling both).
export const match = <T, E, U>(
  result: Result<T, E>,
  handlers: { ok: (value: T) => U; err: (error: E) => U },
): U => (result.ok ? handlers.ok(result.value) : handlers.err(result.error));

// Get the value or a fallback — never throws.
export const unwrapOr = <T, E>(result: Result<T, E>, fallback: T): T =>
  result.ok ? result.value : fallback;
