import { useStore } from "../context/useStore";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function ErrorPage() {
  const { user } = useStore();

  let homePath = "/";
  if (user) {
    if (user.role === "superAdmin") homePath = "/super-admin";
    else if (user.role === "admin") homePath = "/admin";
    else if (user.role === "user") homePath = "/dashboard";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="text-center">
        <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>

        <Link
          to={homePath}
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
