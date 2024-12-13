import {
  Home,
  Unplug,
  SquareTerminal,
  LayoutPanelTop,
  BadgeDollarSign,
  Plus,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Image from "next/image";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export async function AppSidebar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="m-3 flex flex-row justify-start items-center">
        <Image
          alt="Logo"
          src="/logo.svg"
          width={50}
          height={50}
          className="bg-white dark:bg-neutral-800 rounded-xl"
        />
        <div className="flex flex-col justify-center items-start">
          <h3 className="font-semibold text-xl tracking-tighter leading-snug">
            Quirk Inc.
          </h3>
          <p className="leading-snug font-medium">GitHub Workflows</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-base">
                  <a href="/dashboard">
                    <span className="w-6">
                      <Home size={20} />
                    </span>
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-base">
                  <a href="/connections">
                    <span className="w-6">
                      <Unplug size={20} />
                    </span>
                    <span>Connections</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarGroup>
                <SidebarGroupLabel>Workflows</SidebarGroupLabel>
                <SidebarGroupAction>
                  <Plus /> <span className="sr-only">Create Workflow</span>
                </SidebarGroupAction>
                <SidebarGroupContent className="py-2 space-y-1">
                  {true ? (
                    <div className="text-sm text-center flex w-full justify-center">
                      No Workflows Found.
                    </div>
                  ) : (
                    ""
                  )}
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-base">
                  <a href="/logs">
                    <span className="w-6">
                      <SquareTerminal size={20} />
                    </span>
                    <span>Logs</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-base">
                  <a href="/templates">
                    <span className="w-6">
                      <LayoutPanelTop size={20} />
                    </span>
                    <span>Templates</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarGroup>
                <SidebarGroupLabel>Profile</SidebarGroupLabel>
                <SidebarGroupContent className="py-2 space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-base">
                      <a href="/pricing">
                        <span className="w-6">
                          <BadgeDollarSign size={20} />
                        </span>
                        <span>Upgrade</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-base">
                      <LogoutLink>
                        <span className="w-6">
                          <LogOut size={20} />
                        </span>
                        <span>Logout</span>
                      </LogoutLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="m-3 bg-white dark:bg-neutral-800 rounded-xl p-3 flex flex-row justify-start items-start">
        {user?.picture ? (
          <Image
            alt="Logo"
            src={user.picture}
            width={30}
            height={30}
            className="rounded-lg pt-1"
          />
        ) : (
          <UserRound />
        )}
        <div className="flex flex-col justify-start items-start">
          <h3 className="font-semibold text-lg tracking-tighter leading-snug">
            {user?.given_name}
          </h3>
          <small className="leading-snug font-medium">
            You are using Free Plan of Quirk. You are left with {20} Free
            Credits.
          </small>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
