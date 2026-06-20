import prisma from "./prisma";

let dbAvailable: boolean | null = null;
let lastCheck = 0;
const CHECK_INTERVAL_MS = 30_000;

export function forceMockMode(): boolean {
  return process.env.USE_MOCK_DATA === "true";
}

export function isDbConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const err = error as { code?: string; message?: string; name?: string };
  const message = (err.message ?? "").toLowerCase();

  const connectionCodes = new Set([
    "P1000",
    "P1001",
    "P1002",
    "P1003",
    "P1008",
    "P1010",
    "P1017",
    "ECONNREFUSED",
    "ENOTFOUND",
    "ETIMEDOUT",
  ]);

  if (err.code && connectionCodes.has(err.code)) return true;

  return (
    message.includes("can't reach database") ||
    message.includes("connection refused") ||
    message.includes("connect econnrefused") ||
    message.includes("database server") ||
    message.includes("invalid `prisma") ||
    message.includes("environment variable not found") ||
    message.includes("authentication failed")
  );
}

export async function isDatabaseConnected(
  forceRecheck = false
): Promise<boolean> {
  if (forceMockMode()) return false;

  if (!process.env.DATABASE_URL) {
    dbAvailable = false;
    return false;
  }

  const now = Date.now();
  if (
    !forceRecheck &&
    dbAvailable !== null &&
    now - lastCheck < CHECK_INTERVAL_MS
  ) {
    return dbAvailable;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbAvailable = true;
  } catch {
    dbAvailable = false;
  }

  lastCheck = now;
  return dbAvailable;
}

export function markDatabaseUnavailable(): void {
  dbAvailable = false;
  lastCheck = Date.now();
}

export async function shouldUseMockData(): Promise<boolean> {
  return forceMockMode() || !(await isDatabaseConnected());
}
