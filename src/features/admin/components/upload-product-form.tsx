"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateProductSchema,
  type CreateProductSchemaInput,
  type CreateProductSchemaType,
} from "../schemas/product";
import ImageUpload from "./image-upload";
import { useState } from "react";
import { createProduct } from "../actions/create-product";

type UploadProductFormProps = {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
};

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

  const onSubmit = async (values: CreateProductSchemaType) => {
    console.log(values);
    setServerMessage("");

    try {
      const result = await createProduct(values);

      if (!result.success) {
        setServerMessage(result.error);
        return;
      }

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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <h1>Add New Product</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="name">Product Name</label>
          <input
            id="name"
            {...form.register("name")}
            placeholder="e.g. Rozena 2.1 Red"
          />
          <p>{form.formState.errors.name?.message}</p>
        </div>

        <div>
          <label htmlFor="category_id">Category</label>

          <select id="category_id" {...form.register("category_id")}>
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <p>{form.formState.errors.category_id?.message}</p>
        </div>

        <div>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            {...form.register("slug")}
            placeholder="e.g. rozena-2-1-red"
          />
          <p>{form.formState.errors.slug?.message}</p>
        </div>

        <div>
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            {...form.register("brand")}
            placeholder="e.g. Butterfly"
          />
          <p>{form.formState.errors.brand?.message}</p>
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...form.register("price", { valueAsNumber: true })}
          />
          <p>{form.formState.errors.price?.message}</p>
        </div>

        <div>
          <label htmlFor="initialStock">Initial Stock</label>
          <input
            id="initialStock"
            type="number"
            {...form.register("initialStock", { valueAsNumber: true })}
          />
          <p>{form.formState.errors.initialStock?.message}</p>
        </div>

        <div>
          <label htmlFor="discount_percent">Discount (%)</label>
          <input
            id="discount_percent"
            type="number"
            step="0.01"
            {...form.register("discount_percent", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          <p>{form.formState.errors.discount_percent?.message}</p>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...form.register("description")}
            placeholder="Product description..."
          />
          <p>{form.formState.errors.description?.message}</p>
        </div>

        <div>
          <label>
            <input type="checkbox" {...form.register("isActive")} />
            Active Product
          </label>
        </div>
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

      <button type="submit">Create Product</button>
      {serverMessage && <p>{serverMessage}</p>}
    </form>
  );
};

export default UploadProductForm;
