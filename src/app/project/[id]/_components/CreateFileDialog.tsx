import { useCreateFile } from "@/hooks/useCreateFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";

const parentPath = "/app";

interface CreateFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const createFileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  isDirectory: z.boolean().default(false),
});

type CreateFileFormValues = z.infer<typeof createFileSchema>;

export default function CreateFileDialog({
  isOpen,
  onClose,
}: CreateFileDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const projectId = params.id as string;
  const { mutate: createFile, isPending } = useCreateFile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateFileFormValues>({
    resolver: zodResolver(createFileSchema),
    defaultValues: {
      name: "",
      isDirectory: false,
    },
  });

  if (!isOpen) return null;

  const isDirectory = watch("isDirectory");

  const onSubmit = (data: CreateFileFormValues) => {
    setError(null);

    createFile({
      projectId,
      path: `${parentPath}/${data.name}`,
      isDirectory: data.isDirectory,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Close dialog"
        >
          <IoMdClose size={20} />
        </button>
        <h2 className="text-xl font-semibold text-white mb-4">
          Create New {isDirectory ? "Folder" : "File"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${isDirectory ? "folder" : "file"} name (use / for nested folders)`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                {...register("isDirectory")}
                className="mr-2"
              />
              Create as folder
            </label>
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}