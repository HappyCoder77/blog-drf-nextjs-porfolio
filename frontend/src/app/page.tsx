import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        DRF Next.js Blog
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        The full-stack blog built with Django REST Framework and Next.js.
      </p>

      <div className="space-x-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
        >
          Login
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-150 shadow-md"
        >
          Go to Dashboard (Protected Route)
        </Link>
      </div>
    </div>
  );
}
