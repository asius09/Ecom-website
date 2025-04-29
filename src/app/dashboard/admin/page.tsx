'use client'
import AdminDashboard from "@/components/admin/AdminDashboard"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
