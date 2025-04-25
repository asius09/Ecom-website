"use client";

import { UserSettings } from "@/components/user/UserSettings";
import { UserProfile } from "@/components/user/UserProfile";
import { UserPayment } from "@/components/user/UserPayment";
import { UserAddress } from "@/components/user/UserAddress";
import { Sidebar } from "@/components/ui/sidebar";
import { useState } from "react";
import { User, CreditCard, MapPin, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const sidebarItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: <User className="w-5 h-5" />,
      component: <UserProfile />,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="w-5 h-5" />,
      component: <UserPayment />,
    },
    {
      id: "address",
      label: "Address",
      icon: <MapPin className="w-5 h-5" />,
      component: <UserAddress />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      component: <UserSettings />,
    },
  ];

  const handleTabChange = (tab: string) => {
    setIsLoading(true);
    setActiveTab(tab);
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 300);
  };

  const activeComponent = sidebarItems.find(
    (item) => item.id === activeTab
  )?.component;

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 p-4 min-h-[calc(100vh-6rem)]">
      {/* Sidebar */}
      <div className={`w-full ${isMobile ? 'sticky top-16 bg-background z-40' : ''} md:w-64`}>
        <div className="space-y-1 sticky top-20">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-card rounded-lg shadow-sm p-6 min-h-[600px]">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-[400px] w-full mt-6" />
            </div>
          ) : (
            activeComponent
          )}
        </div>
      </div>
    </div>
  );
}
