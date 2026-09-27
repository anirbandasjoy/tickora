import { getVersion } from "@tauri-apps/api/app";
import type { DesktopPlatform } from "@repo/database";

const DEVICE_ID_KEY = "tickora:device-id";

export function getOrCreateDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

export function detectPlatform(): DesktopPlatform {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "MACOS";
  if (ua.includes("win")) return "WINDOWS";
  return "LINUX";
}

export async function getAppVersion(): Promise<string> {
  try {
    return await getVersion();
  } catch {
    return "0.1.0";
  }
}
