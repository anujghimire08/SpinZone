"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProduct } from "../actions/update-product";
import { createProduct } from "@/features/admin/actions/create-product";
import {
  CreateProductSchema,
  CreateProductSchemaInput,
  CreateProductSchemaType,
} from "@/features/admin/schemas/product";

interface ProductFormProps {
  categories: {
    id: string;
    name: string;
  }[];
  initialData?: CreateProductSchemaInput;
  productId?: string;
}

const inputClassName =
  "mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10";

const labelClassName = "block text-sm font-semibold text-zinc-700";

const errorClassName = "mt-1.5 text-xs font-medium text-red-600";

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
  } = useForm<CreateProductSchemaInput, any, CreateProductSchemaType>({
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
      initialStock: initialData?.initialStock ?? 0,
    },
  });

  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: CreateProductSchemaInput) => {
    setServerMessage("");
    setIsSuccess(false);

    try {
      const result = productId
        ? await updateProduct(productId, data)
        : await createProduct(data);

      if (!result.success) {
        setServerMessage(result.error);
        return;
      }

      setIsSuccess(true);
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
      className="w-full max-w-3xl space-y-8"
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Basic Information
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Enter the product name, description, and category.
          </p>
        </div>

        <div>
          <label htmlFor="name" className={labelClassName}>
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            {...register("name")}
            placeholder="Enter product name"
            className={inputClassName}
          />
          {errors.name?.message && (
            <p className={errorClassName}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            placeholder="Enter product description"
            className={`${inputClassName} resize-y`}
          />
          {errors.description?.message && (
            <p className={errorClassName}>{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className={labelClassName}>
            Category <span className="text-red-600">*</span>
          </label>
          <select
            id="category_id"
            {...register("category_id")}
            className={inputClassName}
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id?.message && (
            <p className={errorClassName}>{errors.category_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-5 border-t border-zinc-200 pt-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Pricing and Inventory
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Set the selling price, discount, and stock quantity.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={labelClassName}>
              Price <span className="text-red-600">*</span>
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="99.99"
              className={inputClassName}
            />
            {errors.price?.message && (
              <p className={errorClassName}>{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="discount_percent" className={labelClassName}>
              Discount (%)
            </label>
            <input
              id="discount_percent"
              type="number"
              min="0"
              max="100"
              step="0.01"
              {...register("discount_percent", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              placeholder="10"
              className={inputClassName}
            />
            {errors.discount_percent?.message && (
              <p className={errorClassName}>
                {errors.discount_percent.message}
              </p>
            )}
          </div>
        </div>

        {!productId && (
          <div>
            <label htmlFor="initialStock" className={labelClassName}>
              Initial Stock <span className="text-red-600">*</span>
            </label>
            <input
              id="initialStock"
              type="number"
              min="0"
              step="1"
              {...register("initialStock", { valueAsNumber: true })}
              placeholder="Enter initial stock quantity"
              className={inputClassName}
            />
            {errors.initialStock?.message && (
              <p className={errorClassName}>{errors.initialStock.message}</p>
            )}
            <p className="mt-1.5 text-xs text-zinc-500">
              This quantity will be used to create the product's initial
              inventory.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-5 border-t border-zinc-200 pt-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Product Details
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Configure the product URL, image, and brand.
          </p>
        </div>

        <div>
          <label htmlFor="slug" className={labelClassName}>
            Product Slug <span className="text-red-600">*</span>
          </label>
          <input
            id="slug"
            {...register("slug")}
            placeholder="product-slug"
            className={inputClassName}
          />
          {errors.slug?.message && (
            <p className={errorClassName}>{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="img" className={labelClassName}>
            Image Path <span className="text-red-600">*</span>
          </label>
          <input
            id="img"
            {...register("img")}
            placeholder="/products/product.jpg"
            className={inputClassName}
          />
          {errors.img?.message && (
            <p className={errorClassName}>{errors.img.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="brand" className={labelClassName}>
            Brand <span className="text-red-600">*</span>
          </label>
          <input
            id="brand"
            {...register("brand")}
            placeholder="Enter brand"
            className={inputClassName}
          />
          {errors.brand?.message && (
            <p className={errorClassName}>{errors.brand.message}</p>
          )}
        </div>
      </div>

      {productId && (
        <div className="border-t border-zinc-200 pt-6">
          <label
            htmlFor="isActive"
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              id="isActive"
              type="checkbox"
              {...register("isActive")}
              className="mt-0.5 size-4 accent-violet-700"
            />

            <span>
              <span className="block text-sm font-semibold text-zinc-800">
                Available in Storefront
              </span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                Allow customers to view and purchase this product.
              </span>
            </span>
          </label>
        </div>
      )}

      {serverMessage && (
        <div
          role="alert"
          className={`border px-4 py-3 text-sm ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {serverMessage}
        </div>
      )}

      <div className="border-t border-zinc-200 pt-6">
        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full cursor-pointer bg-violet-700 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-48"
        >
          {isSubmitting
            ? "Saving..."
            : productId
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
