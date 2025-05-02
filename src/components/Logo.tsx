"use client";

import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-semibold text-xl tracking-tight text-primary hover:text-primary/90 transition-colors"
    >
      ShopAF
    </Link>
  );
};
