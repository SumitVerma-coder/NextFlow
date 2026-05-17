import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function AppHeader() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-neutral-200 bg-[#fbfbfa] px-4 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-900 text-[10px] font-semibold text-white dark:bg-white dark:text-neutral-900">
          N
        </div>

        <div className="leading-none">
          <div className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            NextFlow
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
            Workflow Builder
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}