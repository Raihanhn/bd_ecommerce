import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import LandingPageClient from "../components/LandingPageClient"; // move your UI to a client component

export default function LandingPage() {
  // This is never actually rendered when session exists (we redirect below)
  return <LandingPageClient />;
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // ✅ If session exists → redirect to /home (server-side)
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  // ✅ Otherwise → render landing page
  return {
    props: {},
  };
}
