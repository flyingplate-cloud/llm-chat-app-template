/**
 * Type definitions for the Nginx-like Cloudflare Worker
 */

export interface Env {
  ASSETS: Fetcher;
}

export interface ServerInfo {
  server: string;
  version: string;
  timestamp: string;
  userAgent: string | null;
  ip: string | null;
  country: string | null;
}

export interface HealthStatus {
  status: 'healthy';
  timestamp: string;
  worker: string;
}

export interface ApiStatus {
  status: 'running';
  uptime: number;
  endpoints: string[];
}

export interface EchoResponse {
  method: string;
  url: string;
  headers: Record<string, string>;
  timestamp: string;
}
