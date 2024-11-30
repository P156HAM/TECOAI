import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  BookOpen,
  FolderKanban,
  Users,
  BarChart2,
  Library,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeSelector } from "./ThemeSelector";
import logo from "@/assets/BookOpenUser.svg";

const navigation = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Lesson Planner",
    icon: BookOpen,
    href: "/lesson-planner",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    title: "Assessment",
    icon: BarChart2,
    href: "/assessment",
  },
  {
    title: "Resources",
    icon: Library,
    href: "/resources",
  },
  {
    title: "Class Management",
    icon: Users,
    href: "/class-management",
  },
] as const;

function NavUser() {
  const { user, logout } = useAuth();
  // must change the logo and add breadcrumbs and test mobile.

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <div className="flex items-center gap-3 px-3">
            <img
              src={user?.photoURL || ""}
              alt={user?.displayName || "User"}
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {user?.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src={logo} alt="TECO AI" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold text-slate-200">
                    TECO AI
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <Link to={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <LanguageSelector />
        <ThemeSelector />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
