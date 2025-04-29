"use client";

import {
  Package,
  ShoppingCart,
  Users,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: <Package className="w-5 h-5" />,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r p-4">
      <nav className="space-y-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              pathname === link.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {link.icon}
            <span className="ml-3">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
