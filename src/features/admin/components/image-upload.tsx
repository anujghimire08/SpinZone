"use client";

import { upload } from "@imagekit/next";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageUploadProps = {
  categorySlug: string;
  imageFileName: string;
  onUploadComplete: (url: string) => void;
};

const ImageUpload = ({
  imageFileName,
  categorySlug,
  onUploadComplete,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    setSelectedFile(null);
    setImageUrl("");
    setPreviewUrl("");
    setError("");
    onUploadComplete("");
  }, [categorySlug]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setImageUrl("");
    setSelectedFile(null);
    onUploadComplete("");

    if (!file.type.startsWith("image/")) {
      setPreviewUrl("");
      setError("Please select a valid image.");
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      setPreviewUrl("");
      setError("Image size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !categorySlug || !imageFileName) return;
    try {
      setIsUploading(true);
      setError("");

      const response = await fetch("/api/upload-auth");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Authentication failed.");
      }

      const authParams = await response.json();

      const fileExtension = selectedFile.name.split(".").pop();

      const customFileName = `${imageFileName}-${Date.now()}.${fileExtension}`;

      const result = await upload({
        file: selectedFile,
        fileName: customFileName,
        ...authParams,
        folder: `/spinzone/products/${categorySlug}/`,
      });

      if (!result.url) {
        throw new Error("ImageKit did not return an image URL.");
      }

      setImageUrl(result.url);
      onUploadComplete(result.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            Select Product Image
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Choose a clear image of your product.
          </p>
        </div>
        <span className="bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
          Max 5 MB
        </span>
      </div>

      <label
        htmlFor="image"
        className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-zinc-300 bg-white px-5 py-8 text-center transition-colors hover:border-violet-500 hover:bg-violet-50/30"
      >
        <span className="flex size-12 items-center justify-center bg-violet-100 text-violet-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </span>

        <span className="mt-3 text-sm font-semibold text-zinc-800">
          Click to upload an image
        </span>
        <span className="mt-1 text-xs text-zinc-500">
          PNG, JPG, WEBP and other image formats
        </span>

        <input
          id="image"
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {previewUrl && (
        <div className="border border-zinc-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-zinc-800">
            Selected Image Preview
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden bg-zinc-100">
              <Image
                src={previewUrl}
                alt="Product preview"
                width={128}
                height={128}
                unoptimized
                className="size-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-all text-sm font-medium text-zinc-800">
                {selectedFile?.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : ""}
              </p>

              {imageUrl && (
                <p className="mt-3 flex items-center gap-2 text-xs font-medium text-green-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                  Image uploaded successfully!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedFile && !imageUrl && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !categorySlug || !imageFileName}
          className="flex w-full cursor-pointer items-center justify-center gap-2 bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isUploading && (
            <svg
              className="size-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
              />
            </svg>
          )}
          {isUploading ? "Uploading Image..." : "Upload Image"}
        </button>
      )}

      {error && (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="flex items-center gap-2 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
          Product image uploaded successfully.
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
