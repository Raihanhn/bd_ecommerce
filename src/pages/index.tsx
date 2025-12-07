// pages/index.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import LandingPageClient from "../components/LandingPageClient";
import { getUserVisitInfo } from "../lib/cookie";

export default function LandingPage() {
  return <LandingPageClient />;
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // 1️⃣ If already logged in → go to /home
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  // 2️⃣ Check if this user visited before (cookie)
  const visited = getUserVisitInfo(context);

  // 3️⃣ If user visited earlier → go to signup page
  if (visited) {
    return {
      redirect: {
        destination: "/auth/signup",
        permanent: false,
      },
    };
  }

  // 4️⃣ First-time visitor → show landing page + set cookie
  context.res.setHeader(
    "Set-Cookie",
    "visited=true; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax"
  );

  return {
    props: {}, // ✅ Only props key is allowed
  };
}
