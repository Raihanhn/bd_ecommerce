//pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ["/"];
  const shouldHideNavbar = hideNavbarRoutes.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        {!shouldHideNavbar && <Navbar />}

        {/* Make main take all remaining space */}
        <main className="flex-1">
          <Component {...pageProps} />
        </main>

        <Footer />
      </div>
    </SessionProvider>
  );
}
