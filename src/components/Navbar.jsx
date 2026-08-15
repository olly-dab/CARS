import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";

export default function Navbar() {
  const { currentUser } = useAuth();
  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span>CARS</span>
        <span>/</span>
        <span className="text-foreground capitalize font-semibold">Workspace</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-sm">
            {initials}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-semibold text-foreground leading-none">{currentUser?.name || "Admin"}</p>
            <p className="text-muted-foreground mt-0.5">{currentUser?.role || "Administrator"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}