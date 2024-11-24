import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        {isDark ? (
          <Moon className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm">Theme</span>
      </div>

      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-offset-2 focus-visible:ring-offset-white
          ${isDark ? "bg-primary" : "bg-input"}
        `}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span
          className={`
            ${isDark ? "translate-x-5" : "translate-x-0"}
            flex items-center justify-center h-6 w-6 transform rounded-full bg-white
            transition-transform duration-200 ease-in-out
          `}
        />
        <Moon
          className={`
            absolute right-1 h-4 w-4
            text-black transition-opacity duration-200
            ${isDark ? "opacity-100" : "opacity-0"}
          `}
        />
        <Sun
          className={`
            absolute left-1 h-4 w-4
            text-muted-foreground transition-opacity duration-200
            ${isDark ? "opacity-0" : "opacity-100"}
          `}
        />
      </button>
    </div>
  );
}
