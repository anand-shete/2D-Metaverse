import { useState } from "react";
import { Button } from "../ui/button";
import { Home, LogIn, LogOut, Menu, RectangleGoggles, User, X } from "lucide-react";
import { Link } from "react-router";
import { useUserContext } from "@/context/user.context";
import { toast } from "sonner";
import api from "@/api";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useUserContext();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    const { data } = await api.get("/user/logout");
    setUser(data.user);
    toast.success(data.message);
  };

  return (
    <div className="md:hidden">
      <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mr-6">
        {isMenuOpen ? <X className="" /> : <Menu className="" />}
      </Button>

      {/* Mobile menu */}
      <div
        className={`absolute top-0 left-0 -z-20 min-w-full ${isMenuOpen ? "translate-y-22" : "-translate-y-100"} *:bg-primary space-y-3 border-b bg-slate-800 p-4 transition-transform duration-200 *:rounded-sm *:border *:p-2 *:text-sm *:text-black`}
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
        {user === null ? (
          <Link
            to="/login"
            className="flex items-center justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <LogIn className="mr-2" size={16} />
            Login
          </Link>
        ) : (
          <>
            <Link to="/metaverse" className="flex items-center justify-center">
              <RectangleGoggles className="mt-px mr-2" size={20} />
              Enter World
            </Link>
            <Link to="/" className="flex items-center justify-center" onClick={handleLogout}>
              <LogOut className="mr-2" size={16} />
              Logout
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
