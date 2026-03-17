import { Link } from "react-router";
import { DesktopNavbar, MobileNavbar } from ".";
import NavbarLogo from "@/assets/logos/logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-10 flex h-22 min-w-full items-center justify-between border-b bg-slate-900 text-white md:justify-around">
      <Link to="/" className="ml-6 flex items-center">
        <img src={NavbarLogo} alt="metaverse_logo" className="mr-3 h-14 rounded-lg" />
        <h1 className="ml-2 text-xl font-bold tracking-wider text-white">Metaverse</h1>
      </Link>

      <DesktopNavbar />
      <MobileNavbar />
    </nav>
  );
};

export default Navbar;
