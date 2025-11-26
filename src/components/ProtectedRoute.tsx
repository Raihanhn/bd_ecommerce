//components/ProtectedRoute.tsx
//Your ProtectedRoute component ensures that only authenticated users can access
//  certain pages by redirecting unauthenticated users to the login page.

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;
  return <>{children}</>;
}

