import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Loader, Navbar, Footer } from "./components/common";
import { User, UserContext } from "./context/user.context";
import api from "./api";

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
      } catch (error) {
        // catch error promises
      }
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Suspense key={key} fallback={<Loader />}>
        {pathname !== "/metaverse" && <Navbar />}
        <Outlet />
        {pathname !== "/metaverse" && <Footer />}
      </Suspense>
    </UserContext.Provider>
  );
};

export default Layout;
