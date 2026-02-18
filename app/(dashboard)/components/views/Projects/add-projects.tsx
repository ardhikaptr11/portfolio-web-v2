"use client";

import {
  addNewTechStack,
  getAllAvailableTechStack,
} from "@/app/(dashboard)/lib/queries";
import { getAllImages } from "@/app/(dashboard)/lib/queries/assets/client";
import { bulkAddProjects } from "@/app/(dashboard)/lib/queries/projects/actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { cn, formatToSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import FormCardSkeleton from "../../form-card-skeleton";
import { FormCombobox } from "../../forms/form-combobox";
import { FormImage } from "../../forms/form-image";
import { FormInput } from "../../forms/form-input";
import { FormInputGroup } from "../../forms/form-input-group";
import { FormTextarea } from "../../forms/form-textarea";
import ImageDropdown from "../../searchable-dropdown";
import PageContainer from "../../layout/page-container";

const SingleProjectSchema = z.object({
  thumbnail: z.string().nonempty("Please select an image"),
  title: z.string().trim().nonempty("Project title is required"),
  slug: z.string().trim().nonempty("Slug is required"),
  description: z
    .string()
    .trim()
    .nonempty("Project description is required")
    .min(25, "Please describe the project in at least 25 characters")
    .max(500, "Please keep it no longer than 500 characters"),
  overview: z
    .string()
    .trim()
    .nonempty("Project overview is required")
    .min(25, "Project overview must be at least 25 characters long."),
  tech_stack: z
    .array(z.string().nonempty("Please select at least one tech stack"))
    .min(3, "At least 3 must be selected"),
  urls: z.object({
    demo: z.union([z.literal(""), z.url({ protocol: /^https$/ })]),
    github: z.union([
      z.literal(""),
      z
        .string()
        .regex(
          /^(https:\/\/)?(www\.)?github\.com\/\S+$/i,
          "Invalid GitHub URL",
        ),
    ]),
  }),
});

const AddProjectsFormSchema = z.object({
  projects: z.array(SingleProjectSchema),
});

export type TAddProjectsFormValues = z.infer<typeof AddProjectsFormSchema>;

const AddProjects = () => {
  const router = useRouter();

  const [loading, startTransition] = useTransition();
  const [images, setImages] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const [techStack, setTechStack] = useState<string[]>([]);

  const fetchImages = async () => {
    try {
      const res = await getAllImages();

      const images = res.map((image) => ({
        id: image.id,
        label: image.file_name,
        value: image.url,
      }));

      setImages(images);
    } catch (error) {
      toast.error("Failed to fetch images", {
        description: (error as Error).message,
        position: "top-right",
      });
    }
  };

  const fetchTechStack = async () => {
    try {
      const res = await getAllAvailableTechStack();
      setTechStack(res.map((stack) => stack.label));
    } catch (error) {
      toast.error("Failed to fetch tech stack", {
        description: (error as Error).message,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchImages();
    fetchTechStack();
  }, []);

  const handleCreateNew = async (value: string) => {
    try {
      const newAddedTechStack = await addNewTechStack(value);
      setTechStack((prev) => [...prev, newAddedTechStack.label]);
    } catch (error) {
      toast.error("Failed to create new tech stack", {
        description: (error as Error).message,
      });
    }
  };

  const defaultValues = {
    projects: [
      {
        thumbnail: "",
        title: "",
        slug: "",
        description: "",
        overview: "",
        tech_stack: [],
        urls: {
          demo: "",
          github: "",
        },
      },
    ],
  };

  const form = useForm<TAddProjectsFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(AddProjectsFormSchema),
    defaultValues,
  });

  const { control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const watchedProjects = watch("projects");

  const onSubmit = (data: TAddProjectsFormValues) => {
    startTransition(async () => {
      toast.promise(bulkAddProjects(data.projects), {
        loading: "Adding all projects...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.replace("/dashboard/projects"),
            message: "All projects added successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while inserting projects",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <PageContainer
      pageTitle="Add New Projects"
      pageDescription="You can add up to 5 new projects"
      scrollable
    >
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {fields.map((field, index) => {
              const currentTitle = watchedProjects?.[index]?.title;
              const currentThumbnailId = watch(`projects.${index}.thumbnail`);

              const previewUrl =
                images.find((img) => img.id === currentThumbnailId)?.value ||
                "";

              return (
                <Card key={field.id} className="w-full">
                  <CardHeader>
                    <CardTitle className="text-left text-2xl font-bold">
                      <div className="flex items-center justify-between">
                        <h3>
                          {currentTitle || `Untitled Project ${index + 1}`}
                        </h3>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          size="icon"
                          variant="outline"
                          className={cn({
                            hidden: index === 0,
                          })}
                        >
                          <Icons.trash />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormImage
                      className="w-full"
                      name={`projects.${index}.thumbnail`}
                      control={form.control}
                      label="Thumbnail Image"
                      previewUrl={previewUrl}
                      required
                    />
                    <ImageDropdown
                      item="image"
                      options={images}
                      onChange={(value) => {
                        setValue(`projects.${index}.thumbnail`, value, {
                          shouldValidate: true,
                        });
                      }}
                      className="w-full"
                    />
                    <FormInput
                      className="w-full"
                      control={form.control}
                      type="text"
                      name={`projects.${index}.title`}
                      label="Title"
                      disabled={loading}
                      required
                      onChange={(e) => {
                        const newVal = e.target.value;
                        const generatedSlug = formatToSlug(newVal);

                        setValue(`projects.${index}.title`, newVal, {
                          shouldValidate: true,
                        });

                        setValue(`projects.${index}.slug`, generatedSlug, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                    <FormInput
                      className="w-full"
                      control={form.control}
                      type="text"
                      name={`projects.${index}.slug`}
                      label="Slug"
                      disabled
                    />
                    <FormTextarea
                      className="w-full"
                      control={form.control}
                      name={`projects.${index}.description`}
                      label="Project Description"
                      disabled={loading}
                      config={{
                        maxLength: 500,
                        rows: 10,
                        showCharCount: true,
                      }}
                      required
                    />
                    <FormTextarea
                      className="w-full"
                      control={form.control}
                      name={`projects.${index}.overview`}
                      label="Project Overview"
                      disabled={loading}
                      config={{
                        rows: 10,
                        showCharCount: false,
                      }}
                      required
                    />
                    <FormCombobox
                      className="w-full"
                      control={form.control}
                      name={`projects.${index}.tech_stack`}
                      label="Tech Stack"
                      options={techStack}
                      onCreate={(value) => handleCreateNew(value)}
                      disabled={loading}
                      required
                    />
                    <FormInputGroup
                      className="w-full space-y-3"
                      control={form.control}
                      name={`projects.${index}.urls`}
                      label="URLs"
                      inputs={{
                        github: {
                          label: "Source Code",
                          icon: <Icons.github className="size-5" />,
                        },
                        demo: {
                          label: "Demo",
                          icon: <Icons.home className="size-5" />,
                        },
                      }}
                      disabled={loading}
                    />
                  </CardContent>
                </Card>
              );
            })}

            <Button
              type="button"
              variant="outline"
              className={cn(
                "border-muted-foreground text-muted-foreground w-full border-dashed",
                {
                  hidden: fields.length === 5,
                },
              )}
              onClick={() => {
                if (fields.length < 5) {
                  append(defaultValues.projects[0]);
                }
              }}
            >
              <Icons.circlePlus className="size-6" />
              Add New
            </Button>
            <Button disabled={loading} className="w-full" type="submit">
              {loading && <Spinner variant="circle" />}
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default AddProjects;
