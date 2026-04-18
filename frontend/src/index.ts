import { lazy } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Metaverse = lazy(() => import("./pages/Metaverse"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignUp = lazy(() => import("./pages/SignUp"));

export { LandingPage, Metaverse, Login, NotFound, SignUp };
