import type { Metadata } from "next";
import { VerifyView } from "@/views/auth/verify-email/verify-view";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return <VerifyView />;
}
