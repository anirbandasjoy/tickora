import type { Metadata } from "next";
import { AuthorizeDeviceView } from "@/views/dashboard/authorize-device/authorize-device-view";

export const metadata: Metadata = { title: "Authorize device" };

export default function AuthorizeDevicePage() {
  return <AuthorizeDeviceView />;
}
