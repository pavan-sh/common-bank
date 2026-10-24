import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BalanceWidget } from "./BalanceWidget";

const client = new QueryClient();
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element was not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BalanceWidget />
    </QueryClientProvider>
  </React.StrictMode>,
);
