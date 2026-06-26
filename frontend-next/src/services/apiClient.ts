import { ENV } from "@/config/env";

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

type RefreshHandler = () => Promise<string | null>;
let refreshHandler: RefreshHandler | null = null;

export function setRefreshHandler(handler: RefreshHandler | null) {
  refreshHandler = handler;
}

async function request<T>(path: string, options: RequestInit = {}, retrying = false): Promise<T> {
  const url = `${ENV.API_URL}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new ApiClientError(
      "Could not reach the server. Please check your connection.",
      0,
      "network_error",
    );
  }

  if (!response.ok) {
    if (response.status === 401 && !retrying && refreshHandler) {
      const newToken = await refreshHandler();
      if (newToken) {
        const existing = (options.headers as Record<string, string>) ?? {};
        return request<T>(
          path,
          { ...options, headers: { ...existing, Authorization: `Bearer ${newToken}` } },
          true,
        );
      }
    }

    let code = "request_failed";
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as {
        error?: { code?: string; message?: string };
      };
      if (body?.error) {
        code = body.error.code ?? code;
        message = body.error.message ?? message;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiClientError(message, response.status, code);
  }

  return response.json() as Promise<T>;
}

export function get<T>(path: string, token?: string): Promise<T> {
  return request<T>(path, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function post<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
