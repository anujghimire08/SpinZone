"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProduct } from "../actions/update-product";
import {
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/features/admin/schemas/product";
import { useState } from "react";
import { createProduct } from "@/features/admin/actions/create-product";

interface ProductFormProps {
  categories: {
    id: string;
    name: string;
  }[];
  initialData?: CreateProductSchemaType;
  productId?: string;
}

const ProductForm = ({
  categories,
  initialData,
  productId,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      category_id: initialData?.category_id ?? "",
      price: initialData?.price ?? 0,
      slug: initialData?.slug ?? "",
      img: initialData?.img ?? "",
      discount_percent: initialData?.discount_percent ?? 0,
      brand: initialData?.brand ?? "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const [serverMessage, setServerMessage] = useState("");

  const onSubmit = async (data: CreateProductSchemaType) => {
    setServerMessage("");

    try {
      const result = productId
        ? await updateProduct(productId, data)
        : await createProduct(data);

      if (!result.success) {
        setServerMessage(result.error);
        return;
      }

      setServerMessage(
        productId
          ? "Product updated successfully!"
          : "Product created successfully!",
      );

      if (!productId) {
        reset();
      }
    } catch {
      setServerMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 max-w-2xl space-y-5"
    >
      <div>
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          {...register("name")}
          placeholder="Enter product name"
          className="block w-full rounded-md border p-2"
        />
        <p className="text-sm text-red-500">{errors.name?.message}</p>
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Enter product description"
          className="block w-full rounded-md border p-2"
        />
        <p className="text-sm text-red-500">{errors.description?.message}</p>
      </div>

      <div>
        <label htmlFor="category_id">Category</label>
        <select
          id="category_id"
          {...register("category_id")}
          className="block w-full rounded-md border p-2"
        >
          <option value="">Select a category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-red-500">{errors.category_id?.message}</p>
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          placeholder="99.99"
          className="block w-full rounded-md border p-2"
        />
        <p className="text-sm text-red-500">{errors.price?.message}</p>
      </div>

      <div>
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          {...register("slug")}
          placeholder="product-slug"
          className="block w-full rounded-md border p-2"
        />
        <p className="text-sm text-red-500">{errors.slug?.message}</p>
      </div>

      {productId && (
        <div className="flex items-center gap-2">
          <input id="isActive" type="checkbox" {...register("isActive")} />

          <label htmlFor="isActive">Available (visible in storefront)</label>
        </div>
      )}

      <div>
        <label htmlFor="img">Image Path</label>
        <input
          id="img"
          {...register("img")}
          placeholder="/products/product.jpg"
          className="block w-full rounded-md border p-2"
        />
        <p className="text-sm text-red-500">{errors.img?.message}</p>
      </div>

      <div>
        <label htmlFor="discount_percent">Discount (%)</label>
        <input
          id="discount_percent"
          type="number"
          min="0"
          max="100"
          step="0.01"
          {...register("discount_percent", {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
          placeholder="10"
          className="block w-full rounded-md border p-2"
        />
        <p className="text-sm text-red-500">
          {errors.discount_percent?.message}
        </p>
      </div>

      <div>
        <label htmlFor="brand">Brand</label>
        <input
          id="brand"
          {...register("brand")}
          placeholder="Enter brand"
          className="block w-full rounded-md border p-2"
        />
        <p className="text-sm text-red-500">{errors.brand?.message}</p>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="rounded-md bg-blue-600 px-5 py-2 text-white"
      >
        {isSubmitting
          ? "Saving..."
          : productId
            ? "Update Product"
            : "Create Product"}
      </button>
      {serverMessage && <p>{serverMessage}</p>}
    </form>
  );
};

export default ProductForm;
