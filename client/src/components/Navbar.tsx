import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PawPrint, User as UserIcon, LogOut } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const logout = useLogout();

  const isAuthPage = location === "/auth";

  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
              <PawPrint className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">PetWealth</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="hidden sm:flex text-muted-foreground hover:text-primary">
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => logout.mutate()}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" className="hidden sm:flex">Log In</Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
