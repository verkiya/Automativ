import { SidebarTrigger } from "./ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

export const AppHeader = () => {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        shrink-0
        items-center
        justify-between
        border-b
        border-white/40
        bg-white/70
        px-4
        backdrop-blur-2xl
      "
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className="
            h-10
            w-10
            items-center
            rounded-xl
            border
            border-white/40
            bg-white/60
            shadow-sm
            backdrop-blur-xl
            transition-all
            hover:scale-[1.03]
            hover:bg-gradient-to-r
            hover:from-violet-500/8
            hover:to-cyan-500/8
          "
        >
          <PanelLeftIcon className="size-4" />
        </SidebarTrigger>

        <div className="hidden md:flex flex-col">
          <span className="text-sm font-semibold text-slate-900">
            Workspace
          </span>
          <span className="text-xs text-muted-foreground">
            Automativ orchestration
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">{/* future utilities */}</div>
    </header>
  );
};
