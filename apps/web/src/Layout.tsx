import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Loader } from "./components/common";
import { User, UserContext } from "./context/user.context";
import api from "./api";

const Navbar = lazy(() => import("@/components/common/Navbar"));
const Footer = lazy(() => import("@/components/common/Footer"));

const Layout = () => {
  const { pathname, key } = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth");
        const payload = res.data.payload;
        setUser(payload);
      } catch (error) {}
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {pathname === "/metaverse" ? (
        <Suspense key={key}>
          <Outlet />
        </Suspense>
      ) : (
        <Suspense key={key} fallback={<Loader />}>
          <Navbar />
          <Outlet />
          <Footer />
        </Suspense>
      )}
    </UserContext.Provider>
  );
};

export default Layout;
