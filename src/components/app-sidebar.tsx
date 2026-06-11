"use client";

import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import {
  BookOpenIcon,
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const brandFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const menuItems = [
  {
    title: "Home",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
      {
        title: "Project Learnings",
        icon: BookOpenIcon,
        url: "/learnings",
        newTab: true,
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/50 bg-white/75 backdrop-blur-3xl"
    >
      <SidebarHeader className="border-b border-white/40 px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Automativ"
              className="
                h-12
                rounded-2xl
                px-3
                transition-all
                duration-200
                hover:bg-gradient-to-r
                hover:from-violet-500/8
                hover:to-cyan-500/8
              "
            >
              <Link
                href="/workflows"
                prefetch
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  group-data-[collapsible=icon]:justify-center
                  group-data-[collapsible=icon]:gap-0
                "
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-violet-200/40">
                  <Image
                    src="/logo.svg"
                    alt="Automativ"
                    width={30}
                    height={30}
                    priority
                  />
                </div>

                <span
                  className={`
                    ${brandFont.className}
                    text-[1rem]
                    font-semibold
                    tracking-[-0.035em]
                    text-slate-900
                    group-data-[collapsible=icon]:hidden
                  `}
                >
                  Automativ
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems[0].items.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      asChild
                      className={`
                        h-11
                        rounded-2xl
                        px-4
                        text-sm
                        font-medium
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "border border-violet-300/30 bg-gradient-to-r from-violet-500/12 via-indigo-500/8 to-cyan-500/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }
                      `}
                    >
                      <Link
                        href={item.url}
                        prefetch={!item.newTab}
                        target={item.newTab ? "_blank" : undefined}
                        rel={item.newTab ? "noopener noreferrer" : undefined}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          group-data-[collapsible=icon]:justify-center
                          group-data-[collapsible=icon]:gap-0
                        "
                      >
                        <item.icon
                          className={`size-4 shrink-0 ${
                            isActive ? "text-primary" : ""
                          }`}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/40 px-2 py-3">
        <SidebarMenu className="space-y-2">
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="
                  relative
                  isolate
                  h-11
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/20
                  bg-gradient-to-r
                  from-violet-500
                  via-indigo-500
                  to-cyan-500
                  px-4
                  font-semibold
                  !text-white
                  shadow-lg
                  shadow-violet-500/20
                  transition-all
                  duration-300
                  hover:scale-[1.015]
                  hover:shadow-xl
                  hover:shadow-violet-500/30
                  active:scale-[0.985]
                  [&_svg]:!text-white
                  [&_span]:!text-white
                "
                onClick={() => authClient.checkout({ slug: "automativ" })}
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                    translate-x-[-130%]
                    transition-transform
                    duration-700
                    hover:translate-x-[130%]
                  "
                />

                <div className="relative z-10 flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                  <StarIcon className="size-4 shrink-0 transition-transform duration-300 hover:rotate-12 hover:scale-110" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Upgrade to Pro
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {isLoading && (
            <SidebarMenuItem>
              <div className="h-11 animate-pulse rounded-2xl bg-muted/60" />
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className="
                h-11
                rounded-2xl
                px-4
                text-muted-foreground
                transition-all
                hover:bg-muted/60
                hover:text-foreground
              "
              onClick={() => authClient.customer.portal()}
            >
              <div className="flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                <CreditCardIcon className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Billing Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="
                h-11
                rounded-2xl
                px-4
                text-red-500
                transition-all
                hover:bg-red-500/10
                hover:text-red-600
              "
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <div className="flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                <LogOutIcon className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Logout
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
