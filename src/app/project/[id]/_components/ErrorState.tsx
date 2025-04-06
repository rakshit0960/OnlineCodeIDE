export default function ErrorState() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
      <h1 className="text-2xl font-bold text-red-500">Error</h1>
      <p className="mt-2 text-gray-300">An error occurred while loading the project.</p>
    </div>
  );
}
