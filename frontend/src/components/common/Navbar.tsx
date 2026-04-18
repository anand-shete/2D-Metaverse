import { Link } from "react-router";
import { DesktopNavbar, MobileNavbar } from ".";
import NavbarLogo from "@/assets/logos/logo.png";

const Navbar = () => (
  <nav className="shadow-custom fixed top-0 z-10 flex h-22 min-w-full items-center justify-between border-b border-slate-400 text-white shadow-slate-600 backdrop-blur-lg md:justify-around">
    <Link to="/" className="flex items-center">
      <img src={NavbarLogo} alt="metaverse_logo" className="mr-3 h-10 rounded-sm border-white" />
      <h1 className="text-2xl font-semibold">Metaverse</h1>
    </Link>

    <DesktopNavbar />
    <MobileNavbar />
  </nav>
);

export default Navbar;
