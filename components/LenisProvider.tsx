"use client";

import { useLenis } from "@/lib/useLenis";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();
  return <>{children}</>;
}
