import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Home, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", name: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    {
      path: "/signup",
      name: "Sign Up",
      icon: <User className="h-4 w-4 mr-2" />,
    },
    { path: "/login", name: "Login", icon: <LogIn className="h-4 w-4 mr-2" /> },
  ];

  return (
    <nav className="z-1 fixed top-0 w-full bg-slate-800 border-b text-white">
      {/* Desktop view */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center">
              <img
                src="/logos/logo.png"
                alt="metaverse_logo"
                className="h-10 rounded-lg"
              />
              <span className="ml-2 text-xl font-bold text-white tracking-wider ">
                Metaverse
              </span>
            </div>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    location.pathname === item.path
                      ? "bg-sky-500"
                      : "hover:bg-sky-500/30 transition-colors"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 backdrop-blur-lg border-b border-metaverse-purple/20">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md font-medium flex flex-row items-center",
                  location.pathname === item.path ? "bg-[#8b5cf6]" : "hover:[#8b5cf6]/20"
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
