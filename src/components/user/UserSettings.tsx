"use client";

import { Button } from "@/components/ui/button";
import { Bell, LifeBuoy, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UserSettings() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="support">
            <LifeBuoy className="w-4 h-4 mr-2" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get real-time updates
                  </p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button variant="outline">Change</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Support Center</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help from our support team
                  </p>
                </div>
                <Button variant="outline">Contact</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">FAQs</h3>
                  <p className="text-sm text-muted-foreground">
                    Find answers to common questions
                  </p>
                </div>
                <Button variant="outline">View</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
