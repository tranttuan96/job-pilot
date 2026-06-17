import { z } from 'zod';

// Everything that can go wrong calling the API, as a discriminated union on
// `kind`. Callers `switch (error.kind)` and the compiler enforces exhaustiveness
// — no silently-swallowed failure modes.
export type ApiError =
  | { kind: 'network'; message: string } // fetch threw: offline, DNS, CORS
  | { kind: 'timeout'; timeoutMs: number } // aborted by our timeout
  | { kind: 'http'; status: number; body: unknown } // server returned non-2xx
  | { kind: 'parse'; issues: z.ZodError['issues'] }; // response failed schema validation

// Human-readable summary for logging / toasts. Exhaustive: adding a new ApiError
// variant without handling it here is a compile error (the `never` check).
export function describeApiError(error: ApiError): string {
  switch (error.kind) {
    case 'network':
      return `Network error: ${error.message}`;
    case 'timeout':
      return `Request timed out after ${error.timeoutMs}ms`;
    case 'http':
      return `Server returned ${error.status}`;
    case 'parse':
      return `Unexpected response shape (${error.issues.length} issue(s))`;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
