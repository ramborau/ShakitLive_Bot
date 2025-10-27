import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  const results: any = {
    status: "checking...",
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      isNetlify: !!process.env.NETLIFY,
      databaseUrlConfigured: !!process.env.DATABASE_URL,
      facebookTokenConfigured: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    },
    database: {
      status: "unknown",
      error: null,
    },
    counts: {
      users: 0,
      threads: 0,
      messages: 0,
    },
  };

  // Test database connection
  try {
    console.log("[Health Check] Testing database connection...");

    // Try to connect and count records
    const [userCount, threadCount, messageCount] = await Promise.all([
      prisma.user.count(),
      prisma.thread.count(),
      prisma.message.count(),
    ]);

    results.database.status = "connected";
    results.counts = {
      users: userCount,
      threads: threadCount,
      messages: messageCount,
    };

    console.log("[Health Check] Database connection successful");
    console.log(`[Health Check] Counts - Users: ${userCount}, Threads: ${threadCount}, Messages: ${messageCount}`);
  } catch (error) {
    console.error("[Health Check] Database connection FAILED:", error);
    results.database.status = "error";
    results.database.error = error instanceof Error ? error.message : String(error);
  }

  const responseTime = Date.now() - startTime;
  results.responseTimeMs = responseTime;
  results.status = results.database.status === "connected" ? "healthy" : "unhealthy";

  const statusCode = results.status === "healthy" ? 200 : 503;

  return NextResponse.json(results, { status: statusCode });
}
