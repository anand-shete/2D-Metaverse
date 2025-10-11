import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Home, LogIn, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { DesktopNavbar } from ".";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navItems = [
    { path: "/", name: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
    {
      path: "/signup",
      name: "Sign Up",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    { path: "/login", name: "Login", icon: <LogIn className="mr-2 h-4 w-4" /> },
  ];

  return (
    <nav className="fixed top-0 z-10 w-full border-b bg-slate-900 text-white">
      <DesktopNavbar />
      <div className="flex items-center md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="border-metaverse-purple/20 space-y-1 border-b bg-slate-800 px-2 pt-2 pb-3 backdrop-blur-lg sm:px-3">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-row items-center rounded-md px-3 py-2 font-medium",
                  location.pathname === item.path ? "bg-[#8b5cf6]" : "hover:[#8b5cf6]/20",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
