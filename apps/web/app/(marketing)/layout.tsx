import { DownloadHeader } from "@/views/home/landing/download-header";
import { Container } from "@repo/ui/components/core/container";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DownloadHeader />
      <Container size="6xl" className="flex min-h-svh flex-col">
        {children}
      </Container>
    </div>
  );
}
