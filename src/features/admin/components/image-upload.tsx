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
    <div className="space-y-3">
      <label htmlFor="image">Product Image</label>

      <input
        id="image"
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={handleFileChange}
      />

      {previewUrl && (
        <div>
          <p>Selected Image Preview</p>
          <Image
            src={previewUrl}
            alt="Product preview"
            width={200}
            height={200}
            unoptimized
            className="rounded-lg object-cover"
          />
        </div>
      )}

      {selectedFile && !imageUrl && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !categorySlug || !imageFileName}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
      )}

      {imageUrl && (
        <p className="text-green-600">Image uploaded successfully!</p>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
