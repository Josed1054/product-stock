"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React from "react";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function QueryProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
