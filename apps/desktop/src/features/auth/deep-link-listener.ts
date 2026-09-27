import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link";

const SCHEME = "tickora://auth";

export interface AuthCallback {
  code: string;
  requestId: string;
}

function parseAuthUrl(raw: string): AuthCallback | null {
  if (!raw.startsWith(SCHEME)) return null;
  try {
    const url = new URL(raw);
    const code = url.searchParams.get("code");
    const requestId = url.searchParams.get("requestId");
    if (!code || !requestId) return null;
    return { code, requestId };
  } catch {
    return null;
  }
}

export async function listenForAuthLinks(
  onAuthCode: (auth: AuthCallback) => void,
): Promise<() => void> {
  const launched = await getCurrent();
  for (const url of launched ?? []) {
    const parsed = parseAuthUrl(url);
    if (parsed) onAuthCode(parsed);
  }
  return onOpenUrl((urls) => {
    for (const url of urls) {
      const parsed = parseAuthUrl(url);
      if (parsed) onAuthCode(parsed);
    }
  });
}
