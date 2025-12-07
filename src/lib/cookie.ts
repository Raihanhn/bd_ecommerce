// lib/cookie.ts
import { GetServerSidePropsContext } from "next";

export function getUserVisitInfo(context: GetServerSidePropsContext) {
  const cookie = context.req.headers.cookie || "";
  const visited = cookie.includes("visited=true");
  return visited;
}
