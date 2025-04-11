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
    { path: "/login", name: "Login", icon: <LogIn className="h-4 w-4 mr-2" /> },
    {
      path: "/signup",
      name: "Sign In",
      icon: <User className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#1a1f2c]/80 border-b border-metaverse-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-metaverse-purple to-metaverse-blue rounded-md shadow-lg shadow-metaverse-purple/30"></div>
                <span className="ml-2 text-xl font-bold text-white tracking-wider ">
                  PixelVerse
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    location.pathname === item.path
                      ? "bg-metaverse-purple text-white"
                      : "text-gray-300 hover:bg-metaverse-purple/20 hover:text-white transition-colors duration-200"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1a1f2c]/95 backdrop-blur-lg border-b border-metaverse-purple/20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                  location.pathname === item.path
                    ? "bg-metaverse-purple text-white"
                    : "text-gray-300 hover:bg-metaverse-purple/20 hover:text-white"
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
