import Link from "next/link";

export default function NotFoundState() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
      <h1 className="text-2xl font-bold text-red-500">Project Not Found</h1>
      <p className="mt-2 text-gray-300">The project you are looking for does not exist or you don&apos;t have access to it.</p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}