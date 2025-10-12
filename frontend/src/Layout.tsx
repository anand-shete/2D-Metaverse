import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Loader, Navbar, Footer } from "./components/common";

const Layout = () => {
  const { pathname, key } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Suspense key={key} fallback={<Loader />}>
      {pathname !== "/metaverse" && <Navbar />}
      <Outlet />
      {pathname !== "/metaverse" && <Footer />}
    </Suspense>
  );
};

export default Layout;
