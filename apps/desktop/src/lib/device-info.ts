import { getVersion } from "@tauri-apps/api/app";
import type { DesktopPlatform } from "@repo/database";

const DEVICE_ID_KEY = "tickora:device-id";
const DEVICE_NAME_KEY = "tickora:device-name";

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

export function detectArchitecture(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("arm64") || ua.includes("aarch64") || ua.includes("arm"))
    return "arm64";
  if (ua.includes("x86_64") || ua.includes("x64") || ua.includes("win64"))
    return "x64";
  // userAgentData platform hint (Chromium) as secondary signal
  const platform =
    (navigator as any)?.userAgentData?.platform?.toLowerCase?.() ?? "";
  if (platform.includes("arm")) return "arm64";
  return "x64";
}

export function getDeviceName(): string {
  const stored = localStorage.getItem(DEVICE_NAME_KEY);
  if (stored) return stored;
  const platform = detectPlatform();
  const label =
    platform === "MACOS"
      ? "Mac"
      : platform === "WINDOWS"
        ? "Windows PC"
        : "Linux PC";
  const short = getOrCreateDeviceId().slice(0, 4).toUpperCase();
  const name = `${label} ${short}`;
  try {
    localStorage.setItem(DEVICE_NAME_KEY, name);
  } catch {
    // ignore
  }
  return name;
}

export function getHostname(): string | null {
  return null;
}

export function getOsVersion(): string | null {
  return null;
}

export async function getAppVersion(): Promise<string> {
  try {
    return await getVersion();
  } catch {
    return "0.1.0";
  }
}
