import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@material-tailwind/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import i18n from "./i18n/index";
import { useUIStore } from "./stores/uiStore";

const queryClient = new QueryClient();

function RootProviders() {
  const theme = useUIStore((s) => s.theme);
  const lang = useUIStore((s) => s.lang);

  React.useEffect(() => {
    const el = document.documentElement;
    if (theme === "dark") el.classList.add("dark");
    else el.classList.remove("dark");
  }, [theme]);

  React.useEffect(() => {
    // set language for i18n and document direction from persisted store
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RootProviders />
  </React.StrictMode>,
);
