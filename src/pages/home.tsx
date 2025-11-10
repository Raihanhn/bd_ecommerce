import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { signOut } from "next-auth/react";

export default function HomePage({ user }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {user?.name || "User"} 👋
        </h1>
        <p className="text-gray-600 mb-6">
          You’re logged in with {user?.email}
        </p>

       
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // ✅ If no session → redirect to login
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  // ✅ Pass user data to the component
  return {
    props: {
      user: session.user,
    },
  };
}
