import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data in memory so revisiting a screen is instant
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Prefetch a screen as soon as the user hovers/taps a link, and keep the
    // prefetched result cached so navigation feels instant.
    defaultPreload: "intent",
    defaultPreloadDelay: 30,
    defaultPreloadStaleTime: 5 * 60 * 1000,
    defaultStaleTime: 5 * 60 * 1000,
    defaultGcTime: 30 * 60 * 1000,
  });

  return router;
};
