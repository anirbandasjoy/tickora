import { HeroSection } from "./landing/hero-section";
import { OsDownloadGrid } from "./landing/os-download-grid";
import { SetupGuide } from "./landing/setup-guide";

export function HomeView() {
  return (
    <main>
      <div>
        <div className="space-y-16 mt-20">
          <HeroSection />
          <div className="space-y-6">
            <OsDownloadGrid />
            <SetupGuide />
          </div>
        </div>
      </div>
    </main>
  );
}
