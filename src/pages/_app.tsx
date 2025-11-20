import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/"];

  const shouldHideNavbar = hideNavbarRoutes.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? "" : ""}>
        <Component {...pageProps} />
      </main>
       <Footer />
    </SessionProvider>
  );
}
