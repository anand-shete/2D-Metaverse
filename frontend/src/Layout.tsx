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
      <Navbar />
      <Outlet />
      <Footer />
    </Suspense>
  );
};

export default Layout;
