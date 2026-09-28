import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link";

const SCHEME = "tickora:";

export interface AuthCallback {
  code: string;
  requestId: string;
}

function parseAuthUrl(raw: string): AuthCallback | null {
  if (!raw.startsWith(SCHEME)) return null;
  try {
    // On Linux/XDG the URL may arrive as tickora:///auth?... (triple slash)
    // or tickora://auth?... (double slash). Normalise to a parseable form.
    // Spec §9: tickora://auth/callback?code=...&requestId=...
    // Legacy backend emitted tickora://auth?... — accept both.
    const normalised = raw.replace(/^tickora:\/{0,3}/, "tickora://");
    const url = new URL(normalised);
    const hostAndPath = `${url.host}${url.pathname}`.toLowerCase();
    const isAuthPath =
      hostAndPath.startsWith("auth/callback") || hostAndPath.startsWith("auth");
    if (!isAuthPath) return null;
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
