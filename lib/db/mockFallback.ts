import { NextResponse } from "next/server";
import {
  isDbConnectionError,
  markDatabaseUnavailable,
  shouldUseMockData,
} from "./connection";

type MockHeaders = { "X-Data-Source": "mock" };

const mockHeaders: MockHeaders = { "X-Data-Source": "mock" };

export async function mockJson<T>(
  data: T,
  init?: ResponseInit
): Promise<NextResponse> {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...mockHeaders,
    },
  });
}

export async function withMockFallback<T>(
  dbFn: () => Promise<T>,
  mockFn: () => unknown | Promise<unknown>,
  options?: { errorMessage?: string; status?: number }
): Promise<NextResponse> {
  const errorMessage = options?.errorMessage ?? "Request failed";

  try {
    if (await shouldUseMockData()) {
      return mockJson(await mockFn());
    }

    return NextResponse.json(await dbFn());
  } catch (error) {
    if (isDbConnectionError(error)) {
      markDatabaseUnavailable();
      console.warn("[Mock fallback] Database unavailable — serving mock data");
      return mockJson(await mockFn());
    }

    console.error(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function withMockFallbackRaw(
  dbFn: () => Promise<NextResponse>,
  mockFn: () => NextResponse | Promise<NextResponse>,
  errorMessage = "Request failed"
): Promise<NextResponse> {
  try {
    if (await shouldUseMockData()) {
      const response = await mockFn();
      response.headers.set("X-Data-Source", "mock");
      return response;
    }

    return await dbFn();
  } catch (error) {
    if (isDbConnectionError(error)) {
      markDatabaseUnavailable();
      console.warn("[Mock fallback] Database unavailable — serving mock data");
      const response = await mockFn();
      response.headers.set("X-Data-Source", "mock");
      return response;
    }

    console.error(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
