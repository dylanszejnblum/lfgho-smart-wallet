import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { ApplicationProvider } from "@/context/ApplicationContext";

const queryClient = new QueryClient();
import { useAuth } from "@/hooks/useAuth"; // Import the hook

export default function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = useAuth(); // Use the custom hook

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApplicationProvider>
        <QueryClientProvider client={queryClient}>
          {isLoggedIn ? (
            <Layout>
              <Toaster />
              <Component {...pageProps} />
            </Layout>
          ) : (
            <>
              <Toaster />
              <Component {...pageProps} />
            </>
          )}
        </QueryClientProvider>
      </ApplicationProvider>
    </ThemeProvider>
  );
}
