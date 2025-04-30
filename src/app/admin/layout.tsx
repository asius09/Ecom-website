import AdminSidebar from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";
import { validAdmin } from "../api/auth/action";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await validAdmin();
  console.log("Is Admin from admin page", isAdmin);
  if (!isAdmin) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
