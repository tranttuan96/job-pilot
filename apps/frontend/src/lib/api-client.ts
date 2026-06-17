import { z } from 'zod';
import { type Result, ok, err } from 'shared-types';
import type { ApiError } from './api-error';

export interface ApiClientOptions {
  baseUrl: string;
  defaultTimeoutMs?: number;
  // Pulled fresh per request so token refresh "just works".
  getAuthToken?: () => string | undefined;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown; // serialized to JSON; validate it before calling (see api.ts)
  query?: Record<string, string | number | boolean | undefined>;
  // Caller-owned cancellation (e.g. TanStack Query). If omitted, the client's
  // own timeout controller is used.
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ApiClient {
  // Generic over the schema `S`; the success type is INFERRED from it
  // (`z.infer<S>`) rather than annotated — so it stays exact and picks up
  // zod coercions like isoDate -> Date. The response is validated, never cast.
  request<S extends z.ZodType>(
    path: string,
    schema: S,
    options?: RequestOptions,
  ): Promise<Result<z.infer<S>, ApiError>>;
}

function buildUrl(baseUrl: string, path: string, query: RequestOptions['query']): string {
  const url = `${baseUrl}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const { baseUrl, defaultTimeoutMs = 10_000, getAuthToken } = options;

  return {
    async request(path, schema, reqOptions = {}) {
      const { method = 'GET', body, query, timeoutMs = defaultTimeoutMs } = reqOptions;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const headers: Record<string, string> = {};
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      const token = getAuthToken?.();
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Build init conditionally: under exactOptionalPropertyTypes we must omit
      // `body` entirely rather than set it to undefined.
      const init: RequestInit = {
        method,
        headers,
        signal: reqOptions.signal ?? controller.signal,
      };
      if (body !== undefined) init.body = JSON.stringify(body);

      let response: Response;
      try {
        response = await fetch(buildUrl(baseUrl, path, query), init);
      } catch (cause) {
        return cause instanceof DOMException && cause.name === 'AbortError'
          ? err({ kind: 'timeout', timeoutMs })
          : err({
              kind: 'network',
              message: cause instanceof Error ? cause.message : 'Network request failed',
            });
      } finally {
        clearTimeout(timer);
      }

      // Tolerate empty / non-JSON bodies (e.g. 204) without throwing.
      const raw: unknown = await response.json().catch(() => undefined);

      if (!response.ok) {
        return err({ kind: 'http', status: response.status, body: raw });
      }

      // Parse-don't-cast: the schema validates the payload and coerces dates.
      const parsed = schema.safeParse(raw);
      return parsed.success ? ok(parsed.data) : err({ kind: 'parse', issues: parsed.error.issues });
    },
  };
}
