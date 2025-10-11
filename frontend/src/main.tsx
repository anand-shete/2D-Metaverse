import "./index.css";
import * as Lazy from ".";
import Layout from "./Layout";
import { createRoot } from "react-dom/client";
import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Lazy.LandingPage />} />
      <Route path="/signup" element={<Lazy.SignUp />} />
      <Route path="/login" element={<Lazy.Login />} />
      <Route path="/canvas" element={<Lazy.Metaverse />} />
      <Route path="/chat" element={<Lazy.ChatBox />} />
      <Route path="*" element={<Lazy.NotFound />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>,
);
