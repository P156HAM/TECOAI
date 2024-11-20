import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: "profile",
    },
    {
      title: "Practice",
      href: "/practice",
      icon: "practice",
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Learning Journey</h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.href}
                variant={
                  location.pathname === item.href ? "secondary" : "ghost"
                }
                className="w-full justify-start"
                onClick={() => navigate(item.href)}
              >
                <span>{item.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 mt-auto">
        <div className="flex items-center gap-2 px-4 mb-2">
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
