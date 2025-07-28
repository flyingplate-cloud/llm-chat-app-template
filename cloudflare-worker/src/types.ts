/**
 * Type definitions for the Cloudflare Worker
 */

export interface Env {
  ASSETS: Fetcher;
}

export interface ServerInfo {
  server: string;
  version: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  country?: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  worker: string;
}

export interface ApiStatus {
  status: string;
  uptime: number;
  endpoints: string[];
}

export interface EchoResponse {
  method: string;
  url: string;
  headers: Record<string, string>;
  timestamp: string;
}