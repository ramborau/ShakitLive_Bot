import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

interface TokenResponse {
  ret_code: string;
  ret_msg: string;
  item?: {
    token: string;
    expires_in: string;
  };
}

export class TokenService {
  private static readonly TOKEN_REFRESH_INTERVAL = 18 * 60 * 60 * 1000; // 18 hours in milliseconds
  private static refreshTimer: NodeJS.Timeout | null = null;

  /**
   * Check if token needs refresh
   */
  static needsRefresh(): boolean {
    const expiry = parseInt(process.env.SOBOT_TOKEN_EXPIRY || "0");
    const now = Math.floor(Date.now() / 1000);

    // Refresh if expired or will expire in next hour
    return now >= expiry - 3600;
  }

  /**
   * Generate MD5 signature for Sobot API
   */
  private static generateSignature(
    appId: string,
    timestamp: string,
    appKey: string
  ): string {
    const signString = `${appId}${timestamp}${appKey}`;
    return crypto.createHash("md5").update(signString).digest("hex");
  }

  /**
   * Fetch new token from Sobot API
   */
  static async fetchNewToken(): Promise<{
    token: string;
    expiresIn: number;
    generated: number;
  }> {
    const appId = process.env.SOBOT_APP_ID!;
    const appKey = process.env.SOBOT_APP_KEY!;
    const tokenUrl = process.env.SOBOT_TOKEN_URL!;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const sign = this.generateSignature(appId, timestamp, appKey);

    const url = `${tokenUrl}?appid=${appId}&create_time=${timestamp}&sign=${sign}`;

    console.log(`[TokenService] Fetching new token from Sobot API...`);

    const response = await fetch(url);
    const data: TokenResponse = await response.json();

    if (data.ret_code !== "000000" || !data.item) {
      throw new Error(
        `Failed to fetch token: ${data.ret_msg || "Unknown error"}`
      );
    }

    const expiresIn = parseInt(data.item.expires_in);
    const generated = parseInt(timestamp);

    console.log(`[TokenService] New token received, expires in ${expiresIn}s`);

    return {
      token: data.item.token,
      expiresIn,
      generated,
    };
  }

  /**
   * Update .env file with new token
   */
  private static async updateEnvFile(
    token: string,
    generated: number,
    expiry: number
  ): Promise<void> {
    const envPath = path.join(process.cwd(), ".env");
    let envContent = await fs.readFile(envPath, "utf-8");

    // Update token
    envContent = envContent.replace(
      /SOBOT_TOKEN=.*/,
      `SOBOT_TOKEN=${token}`
    );

    // Update generated timestamp
    envContent = envContent.replace(
      /SOBOT_TOKEN_GENERATED=.*/,
      `SOBOT_TOKEN_GENERATED=${generated}`
    );

    // Update expiry timestamp
    envContent = envContent.replace(
      /SOBOT_TOKEN_EXPIRY=.*/,
      `SOBOT_TOKEN_EXPIRY=${expiry}`
    );

    await fs.writeFile(envPath, envContent, "utf-8");

    // Update process.env in runtime
    process.env.SOBOT_TOKEN = token;
    process.env.SOBOT_TOKEN_GENERATED = generated.toString();
    process.env.SOBOT_TOKEN_EXPIRY = expiry.toString();

    console.log(`[TokenService] .env file updated with new token`);
  }

  /**
   * Refresh token if needed
   */
  static async refreshIfNeeded(): Promise<void> {
    if (!this.needsRefresh()) {
      console.log(`[TokenService] Token is still valid`);
      return;
    }

    console.log(`[TokenService] Token expired or expiring soon, refreshing...`);

    try {
      const { token, expiresIn, generated } = await this.fetchNewToken();
      const expiry = generated + expiresIn;

      await this.updateEnvFile(token, generated, expiry);

      console.log(
        `[TokenService] Token refreshed successfully. New expiry: ${new Date(
          expiry * 1000
        ).toISOString()}`
      );
    } catch (error) {
      console.error(`[TokenService] Failed to refresh token:`, error);
      throw error;
    }
  }

  /**
   * Start automatic token refresh every 18 hours
   */
  static startAutoRefresh(): void {
    if (this.refreshTimer) {
      console.log(`[TokenService] Auto-refresh already running`);
      return;
    }

    console.log(
      `[TokenService] Starting auto-refresh (every 18 hours)...`
    );

    // Initial check
    this.refreshIfNeeded().catch((error) => {
      console.error(`[TokenService] Initial refresh failed:`, error);
    });

    // Set up recurring refresh
    this.refreshTimer = setInterval(() => {
      this.refreshIfNeeded().catch((error) => {
        console.error(`[TokenService] Auto-refresh failed:`, error);
      });
    }, this.TOKEN_REFRESH_INTERVAL);

    console.log(`[TokenService] Auto-refresh started`);
  }

  /**
   * Stop automatic token refresh
   */
  static stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log(`[TokenService] Auto-refresh stopped`);
    }
  }

  /**
   * Get current token (refreshes if needed)
   */
  static async getToken(): Promise<string> {
    await this.refreshIfNeeded();
    return process.env.SOBOT_TOKEN!;
  }
}
