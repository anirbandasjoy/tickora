import type { Metadata } from "next";
import { ResetView } from "../../../views/auth/reset-password/reset-view";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return <ResetView />;
}
