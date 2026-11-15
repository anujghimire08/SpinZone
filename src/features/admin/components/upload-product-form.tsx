"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateProductSchema,
  type CreateProductSchemaInput,
  type CreateProductSchemaType,
} from "../schemas/product";
import ImageUpload from "./image-upload";
import { createProduct } from "../actions/create-product";

type UploadProductFormProps = {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
};

const inputClassName =
  "mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-700/10";

const labelClassName = "block text-sm font-semibold text-zinc-700";

const errorClassName = "mt-1.5 text-xs font-medium text-red-600";

const UploadProductForm = ({ categories }: UploadProductFormProps) => {
  const form = useForm<CreateProductSchemaInput, any, CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: "",
      price: 0,
      slug: "",
      img: "",
      discount_percent: undefined,
      isActive: true,
      brand: "",
      initialStock: 0,
    },
  });

  const { reset } = form;

  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (values: CreateProductSchemaType) => {
    setServerMessage("");
    setIsSuccess(false);

    try {
      const result = await createProduct(values);

      if (!result.success) {
        setServerMessage(result.error);
        return;
      }

      setIsSuccess(true);
      setServerMessage("Product created successfully!");
      reset();
    } catch {
      setServerMessage("Something went wrong. Please try again.");
    }
  };

  const selectedCategoryId = form.watch("category_id");
  const productName = form.watch("name");

  const imageFileName = productName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-3xl space-y-8"
    >
      <div>
        <h2 className="text-base font-semibold text-zinc-950">
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Enter the product name, category, and brand details.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            {...form.register("name")}
            placeholder="e.g. Rozena 2.1 Red"
            className={inputClassName}
          />
          {form.formState.errors.name?.message && (
            <p className={errorClassName}>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className={labelClassName}>
            Category <span className="text-red-600">*</span>
          </label>

          <select
            id="category_id"
            {...form.register("category_id")}
            className={inputClassName}
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {form.formState.errors.category_id?.message && (
            <p className={errorClassName}>
              {form.formState.errors.category_id.message}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="slug" className={labelClassName}>
              Product Slug <span className="text-red-600">*</span>
            </label>
            <input
              id="slug"
              {...form.register("slug")}
              placeholder="e.g. rozena-2-1-red"
              className={inputClassName}
            />
            {form.formState.errors.slug?.message && (
              <p className={errorClassName}>
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="brand" className={labelClassName}>
              Brand <span className="text-red-600">*</span>
            </label>
            <input
              id="brand"
              {...form.register("brand")}
              placeholder="e.g. Butterfly"
              className={inputClassName}
            />
            {form.formState.errors.brand?.message && (
              <p className={errorClassName}>
                {form.formState.errors.brand.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5 border-t border-zinc-200 pt-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Pricing and Inventory
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Configure the selling price, initial stock, and discount.
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
              {...form.register("price", { valueAsNumber: true })}
              placeholder="99.99"
              className={inputClassName}
            />
            {form.formState.errors.price?.message && (
              <p className={errorClassName}>
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="initialStock" className={labelClassName}>
              Initial Stock <span className="text-red-600">*</span>
            </label>
            <input
              id="initialStock"
              type="number"
              min="0"
              step="1"
              {...form.register("initialStock", { valueAsNumber: true })}
              placeholder="Enter stock quantity"
              className={inputClassName}
            />
            {form.formState.errors.initialStock?.message && (
              <p className={errorClassName}>
                {form.formState.errors.initialStock.message}
              </p>
            )}
            <p className="mt-1.5 text-xs text-zinc-500">
              This quantity will be used to initialize product inventory.
            </p>
          </div>
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
            {...form.register("discount_percent", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            placeholder="10"
            className={inputClassName}
          />
          {form.formState.errors.discount_percent?.message && (
            <p className={errorClassName}>
              {form.formState.errors.discount_percent.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5 border-t border-zinc-200 pt-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Product Description
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Provide additional information about this product.
          </p>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...form.register("description")}
            placeholder="Describe the product..."
            className={`${inputClassName} resize-y`}
          />
          {form.formState.errors.description?.message && (
            <p className={errorClassName}>
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5 border-t border-zinc-200 pt-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Product Image
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Upload an image for your product.
          </p>
        </div>

        <ImageUpload
          imageFileName={imageFileName}
          categorySlug={selectedCategory?.slug || ""}
          onUploadComplete={(url) => {
            form.setValue("img", url, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />

        {form.formState.errors.img?.message && (
          <p className={errorClassName}>{form.formState.errors.img.message}</p>
        )}

        {form.watch("img") && (
          <p className="break-all text-xs text-green-700">
            Product image uploaded successfully.
          </p>
        )}
      </div>

      <div className="border-t border-zinc-200 pt-6">
        <label
          htmlFor="isActive"
          className="flex cursor-pointer items-start gap-3"
        >
          <input
            id="isActive"
            type="checkbox"
            {...form.register("isActive")}
            className="mt-0.5 size-4 accent-violet-700"
          />

          <span>
            <span className="block text-sm font-semibold text-zinc-800">
              Active Product
            </span>
            <span className="mt-1 block text-xs leading-5 text-zinc-500">
              Make this product visible in your storefront.
            </span>
          </span>
        </label>
      </div>

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
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer bg-violet-700 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-48"
        >
          {form.formState.isSubmitting
            ? "Creating Product..."
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default UploadProductForm;
