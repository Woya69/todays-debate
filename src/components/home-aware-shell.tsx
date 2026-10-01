"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function HomeAwareShell({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {header}
      <main
        className={`mx-auto w-full flex-1 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 ${
          isHome
            ? "max-w-5xl py-2 sm:py-4"
            : "max-w-5xl py-6 sm:py-10"
        }`}
      >
        {children}
      </main>
      {!isHome && footer}
    </>
  );
}
