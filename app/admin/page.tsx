import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAdminOverview, isBackendAdmin } from "@/lib/external-api";
import { SiteHeader } from "@/components/site-header";
import { AdminDashboard } from "./admin-dashboard";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  if (!(await isBackendAdmin(session.user.id))) redirect("/");
  const data = await getAdminOverview(session.user.id);
  return (
    <main className="admin-surface ocean-home min-h-screen bg-[#040b18]">
      <SiteHeader compact ocean />
      <AdminDashboard initialData={data} />
    </main>
  );
}
