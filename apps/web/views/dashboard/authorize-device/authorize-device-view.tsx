import { Suspense } from "react";
import { AuthorizeDeviceForm } from "@/views/dashboard/authorize-device/authorize-device-form";

export function AuthorizeDeviceView() {
  return (
    <Suspense>
      <AuthorizeDeviceForm />
    </Suspense>
  );
}
