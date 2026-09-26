"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  return (
    <NextTopLoader
      color="var(--primary)"
      height={3}
      showSpinner={false}
      shadow="0 0 10px var(--primary), 0 0 5px var(--primary)"
    />
  );
}
