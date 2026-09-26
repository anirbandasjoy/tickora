import { AppWindow, Laptop, Sparkles, Terminal } from "lucide-react";
import { Badge } from "@repo/ui/components/core/badge";
import { PlatformCard } from "./platform-card";

export function OsDownloadGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <PlatformCard
        icon={Laptop}
        name="macOS"
        sub="Universal Binary"
        tag={
          <Badge variant="primary" appearance="fade" size="sm">
            <Sparkles className="size-3" />
            Detected
          </Badge>
        }
        blurb="Optimized for Apple Silicon (M1–M5) ."
        downloadLabel="Download .dmg (Universal)"
        downloadHref="#download-mac"
        primary
        command="brew install --cask tickora"
      />
      <PlatformCard
        icon={AppWindow}
        name="Windows"
        sub="64-bit installer"
        tag={
          <Badge variant="dim" size="sm">
            Win 10/11
          </Badge>
        }
        blurb="Signed MSI installer with automatic background updates."
        downloadLabel="Download .msi (x64)"
        downloadHref="#download-win"
        command="winget install Tickora.Tickora"
        prompt=">"
      />
      <PlatformCard
        icon={Terminal}
        name="Linux"
        sub="Wayland & X11"
        tag={
          <span className="flex gap-1">
            <Badge variant="dim" size="xs" className="font-mono">
              .deb
            </Badge>
            <Badge variant="dim" size="xs" className="font-mono">
              AppImage
            </Badge>
          </span>
        }
        blurb="Direct portable executable and native Debian packaging."
        downloadLabel="Download .deb"
        downloadHref="#download-deb"
        command="yay -S tickora-bin"
      />
    </section>
  );
}
