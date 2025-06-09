"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { CategoryFormDto } from "@/utils/models/category.model";
import {
  useCreateCategoryMutation,
  useCreateSubCategoryMutation,
  useUpdateCategoryWithSubMutation,
} from "@/lib/services/category.service";
import toast from "react-hot-toast";
import { FileInput } from "./ui/FileInput";
import { FileUploadDto } from "@/utils/models/common.model";

// Define the validation schema for subcategory
const subcategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, {
    message: "Subcategory name must be at least 2 characters.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL for the subcategory image.",
  }),
});

// Define the validation schema for the form
const formSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  categoryImageURL: z.string().url(),
  subcategories: z.array(subcategorySchema).min(1, {
    message: "At least one subcategory is required.",
  }),
});

// Define the types based on the schema
type FormValues = z.infer<typeof formSchema>;
type SubcategoryDto = z.infer<typeof subcategorySchema>;

// Define the props for the component
interface CategoryFormProps {
  initialData?: CategoryFormDto;
  onSubmit: (data: FormValues) => void;
  callBack: () => void;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  callBack,
}: CategoryFormProps) {
  const [updateCategory] = useUpdateCategoryWithSubMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      categoryImageURL: "",
      subcategories: [
        {
          name: "",
          imageUrl: "",
        },
      ],
    },
  });

  // Set up field array for subcategories
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subcategories",
  });

  const handleFileUpload = async (file: File, key: string) => {
    setIsImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/uploadToDrive", {
      method: "POST",
      body: formData,
    });

    const data: FileUploadDto = await res.json();
    if (data.fileId) {
      form.setValue(key as keyof CategoryFormDto, data.url);
      setIsImageUploading(false);
    }
  };

  // Handle form submission for both create and update modes
  const handleSubmit = async (formData: FormValues) => {
    setIsLoading(true);

    try {
      if (isEditMode) {
        const subCategoriesToAdd = formData.subcategories.filter(
          (subcategory) => !subcategory._id || subcategory._id === "0"
        );
        const subCategoriesToUpdate = formData.subcategories.filter(
          (subcategory) => subcategory._id && subcategory._id !== "0"
        );
        // Update existing category with subcategories
        const updateResponse = await updateCategory({
          id: formData._id || "",
          data: { ...formData, subcategories: subCategoriesToUpdate },
        }).unwrap();
        if (subCategoriesToAdd.length) {
          // Create new subcategories for the existing category
          const subcategoryResponses = await Promise.all(
            subCategoriesToAdd.map((subcategory) =>
              createSubCategory({
                category: formData.name,
                subcategory: {
                  name: subcategory.name,
                  imageUrl: subcategory.imageUrl,
                },
              }).unwrap()
            )
          );

          const allSubcategoriesCreated = subcategoryResponses.every(
            (res) => res.success
          );

          if (allSubcategoriesCreated) {
            toast.success("Subcategories Added Successfully");
          }
        }

        if (updateResponse.success) {
          toast.success("Category Updated Successfully");
        }
      } else {
        // Create new category
        const newCategoryPayload = {
          name: formData.name,
          categoryImageURL: formData.categoryImageURL,
        };

        const createCategoryResponse =
          await createCategory(newCategoryPayload).unwrap();

        if (createCategoryResponse.success) {
          // Create all subcategories for the new category
          const subcategoryResponses = await Promise.all(
            formData.subcategories.map((subcategory) =>
              createSubCategory({
                category: formData.name,
                subcategory: {
                  name: subcategory.name,
                  imageUrl: subcategory.imageUrl,
                },
              }).unwrap()
            )
          );

          const allSubcategoriesCreated = subcategoryResponses.every(
            (res) => res.success
          );

          if (allSubcategoriesCreated) {
            toast.success("Category Added Successfully");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving the category.");
    } finally {
      callBack();
      setIsLoading(false);
    }
  };

  // Add a new empty subcategory
  const addSubcategory = () => {
    append({ _id: "0", name: "", imageUrl: "" });
  };

  const isEditMode = !!initialData?._id;

  return (
    <Card className='w-full max-w-2xl mx-auto shadow-none border-none'>
      <CardHeader>
        <CardTitle className='flex flex-row gap-2'>
          <ArrowLeft onClick={callBack} className='cursor-pointer' />
          {isEditMode ? "Edit Category" : "Add New Category"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the details of an existing category and its subcategories."
            : "Add a new category with subcategories to your platform."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Category Details</h3>

              {isEditMode && (
                <FormField
                  control={form.control}
                  name='_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter category name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categoryImageURL'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <FileInput
                        id={"categoryImageURL"}
                        name={"categoryImageURL"}
                        label={""}
                        accept='image/*'
                        maxSize={10}
                        onChange={(e) => {
                          if (e) {
                            handleFileUpload(e, "categoryImageURL");
                          }
                        }}
                        {...(field.value && { previewUrl: field.value })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-medium'>Subcategories</h3>
                <Button
                  type='button'
                  onClick={addSubcategory}
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1'
                  title={"+"}
                />
              </div>

              {form.formState.errors.subcategories?.message && (
                <p className='text-sm font-medium text-destructive'>
                  {form.formState.errors.subcategories.message}
                </p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className='border rounded-md p-4 relative'>
                  <div className='absolute right-2 top-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length <= 1}
                      className='h-8 w-8 text-destructive'
                      title='X'
                    />
                  </div>

                  <h4 className='font-medium mb-3'>Subcategory {index + 1}</h4>

                  {field._id && isEditMode && (
                    <FormField
                      control={form.control}
                      name={`subcategories.${index}._id` as const}
                      render={({ field: idField }) => (
                        <FormItem className='mb-3'>
                          <FormLabel>Subcategory ID</FormLabel>
                          <FormControl>
                            <Input
                              {...idField}
                              value={idField.value || ""}
                              disabled
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name={`subcategories.${index}.name` as const}
                    render={({ field: nameField }) => (
                      <FormItem className='mb-3'>
                        <FormLabel>Subcategory Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter subcategory name'
                            {...nameField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`subcategories.${index}.imageUrl` as const}
                    render={({ field: imageField }) => (
                      <FormItem>
                        <FormLabel>Subcategory Image URL</FormLabel>
                        <FormControl>
                          <FileInput
                            id={`subcategories.${index}.imageUrl`}
                            name={`subcategories.${index}.imageUrl`}
                            label={""}
                            accept='image/*'
                            maxSize={10}
                            onChange={(e) => {
                              if (e) {
                                handleFileUpload(
                                  e,
                                  `subcategories.${index}.imageUrl`
                                );
                              }
                            }}
                            {...(imageField.value && {
                              previewUrl: imageField.value,
                            })}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a valid URL for the subcategory image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <CardFooter className='px-0 pt-6'>
              <Button
                type='submit'
                disabled={isLoading}
                className='ml-auto'
                title={
                  isImageUploading
                    ? "Uploading Image..."
                    : isLoading
                      ? "Saving..."
                      : isEditMode
                        ? "Update Category"
                        : "Create Category"
                }
              />
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
