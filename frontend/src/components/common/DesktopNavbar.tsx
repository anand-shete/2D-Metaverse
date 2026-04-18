import { useUserContext } from "@/context/user.context";
import { Home, LogIn, User, RectangleGoggles, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/api";
import { toast } from "sonner";

const DesktopNavbar = () => {
  const { user, setUser } = useUserContext();

  const handleLogout = async () => {
    const { data } = await api.get("/user/logout");
    setUser(data.user);
    toast.success(data.message);
  };

  return (
    <div className="*:hover:bg-primary hidden items-center justify-center space-x-10 *:rounded-md *:px-3 *:py-2 *:transition-all *:duration-200 *:hover:scale-110 *:hover:text-black md:flex">
      <Link to="/" className="flex">
        <Home className="mt-px mr-2" size={20} />
        Home
      </Link>
      <Link to="/signup" className="flex">
        <User className="mt-px mr-2" size={20} />
        Sign Up
      </Link>
      <Link to="/metaverse" className="flex">
        <RectangleGoggles className="mt-px mr-2" size={20} />
        Enter World
      </Link>
      {user === null ? (
        <Link to="/login" className="bg-primary flex text-black">
          <LogIn className="mt-px mr-2" size={20} />
          Login
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary">
              {user.username}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default DesktopNavbar;
