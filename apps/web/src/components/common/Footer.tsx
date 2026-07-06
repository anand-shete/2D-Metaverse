import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t border-white bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-md">
            <h3 className="mt-5 text-2xl font-bold text-white">2D Metaverse</h3>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              A shared virtual campus for real-time interaction.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 text-sm text-slate-400 md:items-end">
            <NavLink to="/login" className="transition-colors hover:text-white">
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="transition-colors hover:text-white"
            >
              Signup
            </NavLink>

            <NavLink
              to="/metaverse"
              className="transition-colors hover:text-white"
            >
              Enter virtual world
            </NavLink>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        <div className="text-sm text-slate-500 md:flex-row">
          <p>© 2026 Metaverse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
