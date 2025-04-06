import { ImSpinner8 } from "react-icons/im";

export default function LoadingState() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <ImSpinner8 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-lg text-gray-300">Loading project...</span>
    </div>
  );
}