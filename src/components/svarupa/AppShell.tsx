import { BottomNavigation, SidebarNavigation } from "./Navigation";

export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="paper-grain min-h-dvh lg:flex">
      <SidebarNavigation userName={userName} />
      <div className="min-w-0 flex-1">
        <main
          id="main"
          className="mx-auto w-full max-w-3xl px-5 pb-28 pt-8 sm:max-w-4xl sm:px-8 lg:max-w-5xl lg:px-12 lg:pb-16 lg:pt-12"
        >
          {children}
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}
