'use client'
import { useRealTimeFetchData } from "@/hooks/useRealTimeFetchData";

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
    useRealTimeFetchData();

  return <>{children}</>;
}
