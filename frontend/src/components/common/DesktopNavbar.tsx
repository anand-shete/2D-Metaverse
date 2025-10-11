import { Home, LogIn, User } from "lucide-react";
import { Link } from "react-router";

const DesktopNavbar = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-22 items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <div className="flex items-center">
            <img src="/logos/logo.png" alt="metaverse_logo" className="mr-3 h-14 rounded-lg" />
            <span className="ml-2 text-xl font-bold tracking-wider text-white">Metaverse</span>
          </div>
        </Link>

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
      </div>
    </div>
  );
};

export default DesktopNavbar;
