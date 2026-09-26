import type { Metadata } from "next";
import { ForgotView } from "../../../views/auth/forgot-password/forgot-view";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return <ForgotView />;
}
