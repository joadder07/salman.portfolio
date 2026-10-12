import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | Portfolio & Research",
  description: "Secure management console for projects, gallery items, and messages.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </SessionProviderWrapper>
  );
}
