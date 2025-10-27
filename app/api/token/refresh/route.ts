import { NextResponse } from "next/server";
import { TokenService } from "@/lib/services/token-service";

export async function POST() {
  try {
    await TokenService.refreshIfNeeded();

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      expiry: process.env.SOBOT_TOKEN_EXPIRY,
    });
  } catch (error) {
    console.error("Token refresh failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const expiry = parseInt(process.env.SOBOT_TOKEN_EXPIRY || "0");
  const now = Math.floor(Date.now() / 1000);
  const needsRefresh = TokenService.needsRefresh();

  return NextResponse.json({
    token: process.env.SOBOT_TOKEN?.substring(0, 10) + "...",
    generated: process.env.SOBOT_TOKEN_GENERATED,
    expiry: process.env.SOBOT_TOKEN_EXPIRY,
    expiresAt: new Date(expiry * 1000).toISOString(),
    timeUntilExpiry: expiry - now,
    needsRefresh,
  });
}
