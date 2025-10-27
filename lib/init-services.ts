import { TokenService } from "./services/token-service";

let initialized = false;

export function initializeServices() {
  if (initialized) return;

  console.log("[Init] Initializing services...");

  // Start token auto-refresh
  TokenService.startAutoRefresh();

  initialized = true;
  console.log("[Init] Services initialized");
}

// Initialize on module load
if (typeof window === "undefined") {
  // Only run on server side
  initializeServices();
}
