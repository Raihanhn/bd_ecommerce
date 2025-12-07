// lib/redirectHelpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { GetServerSidePropsContext } from "next";
import { getUserVisitInfo } from "./cookie";

export async function requireAuthOrVisited(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Already logged in → redirect to home
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  // Check if user has visited landing page
  const visited = getUserVisitInfo(context);
  if (!visited) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
