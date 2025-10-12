import { Home, LogIn, User } from "lucide-react";
import { Link } from "react-router";

const DesktopNavbar = () => (
  <div className="hidden items-center justify-center space-x-10 *:rounded-md *:px-3 *:py-2 *:transition-all *:duration-200 *:hover:scale-110 *:hover:bg-primary md:flex">
    <Link to="/" className="flex">
      <Home className="mt-[1px] mr-2" size={20} />
      Home
    </Link>
    <Link to="/signup" className="flex">
      <User className="mt-[1px] mr-2" size={20} />
      Sign Up
    </Link>
    <Link to="/login" className="flex">
      <LogIn className="mt-[1px] mr-2" size={20} />
      Login
    </Link>
  </div>
);

export default DesktopNavbar;
