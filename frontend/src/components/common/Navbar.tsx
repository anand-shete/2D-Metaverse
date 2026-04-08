import { Link } from "react-router";
import { DesktopNavbar, MobileNavbar } from ".";
import NavbarLogo from "@/assets/logos/logo.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-10 flex h-22 min-w-full items-center justify-between border-b text-white backdrop-blur-xl md:justify-around">
      <Link to="/" className="flex items-center">
        <img src={NavbarLogo} alt="metaverse_logo" className="mr-3 h-10 rounded-sm border-white" />
        <h1 className="text-2xl font-semibold">Metaverse</h1>
      </Link>

      <DesktopNavbar />
      <MobileNavbar />
    </nav>
  );
};

export default Navbar;
