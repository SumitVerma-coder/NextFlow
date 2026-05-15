import { AppHeader } from "@/components/layout/app-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f7f6] text-neutral-900">
      <AppHeader />
      {children}
    </div>
  );
}