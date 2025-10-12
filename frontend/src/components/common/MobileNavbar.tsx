import { useState } from "react";
import { Button } from "../ui/button";
import { Home, LogIn, Menu, User, X } from "lucide-react";
import { Link } from "react-router";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="md:hidden">
      <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mr-6">
        {isMenuOpen ? <X className="" /> : <Menu className="" />}
      </Button>

      {/* Mobile menu */}
      <div
        className={`absolute top-0 left-0 -z-20 min-w-full ${isMenuOpen ? "translate-y-22" : "-translate-y-50"} space-y-3 border-b bg-slate-800 p-4 transition-transform duration-200 *:rounded-sm *:border *:bg-primary *:p-2 *:text-sm *:text-black`}
      >
        <Link
          to="/"
          className="flex items-center justify-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <Home className="mr-2" size={16} />
          Home
        </Link>
        <Link
          to="/signup"
          className="flex items-center justify-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <User className="mr-2" size={16} />
          Sign Up
        </Link>
        <Link
          to="/login"
          className="flex items-center justify-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <LogIn className="mr-2" size={16} />
          Login
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
