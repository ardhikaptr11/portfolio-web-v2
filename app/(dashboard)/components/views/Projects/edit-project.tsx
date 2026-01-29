"use client";

import {
  addNewTechStack,
  getAllAvailableTechStack,
} from "@/app/(dashboard)/lib/queries";
import { getALlImages } from "@/app/(dashboard)/lib/queries/assets/client";
import { IProject } from "@/app/(dashboard)/types/data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { formatToSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import FormCardSkeleton from "../../form-card-skeleton";
import { FormCombobox } from "../../forms/form-combobox";
import { FormImage } from "../../forms/form-image";
import { FormInput } from "../../forms/form-input";
import { FormInputGroup } from "../../forms/form-input-group";
import { FormTextarea } from "../../forms/form-textarea";
import { Heading } from "../../heading";
import ImageDropdown from "../../image-dropdown";
import PageContainer from "../../layout/page-container";
import { isEqual } from "lodash";
import { updateSelectedProject } from "@/app/(dashboard)/lib/queries/projects/actions";
import { useRouter } from "next/navigation";

const UpdateProjectFormSchema = z.object({
  asset_id: z.string().nonempty("Please select an image"),
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
    .array(z.string().nonempty("Tech stack is required"))
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

export type TUpdateProjectFormValues = z.infer<typeof UpdateProjectFormSchema>;

const EditProject = ({ project }: { project: IProject }) => {
  // const router = useRouter()
  const router = useRouter();

  const { asset_id, title, slug, description, overview, tech_stack, urls } =
    project;

  const [heading, setHeading] = useState(title);
  const [loading, startTransition] = useTransition();
  const [images, setImages] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  const defaultValues = {
    asset_id,
    title,
    slug,
    description,
    overview,
    tech_stack,
    urls,
  };

  const form = useForm<TUpdateProjectFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(UpdateProjectFormSchema),
    defaultValues,
  });

  const {
    setValue,
    formState: { dirtyFields },
  } = form;

  const selectedId = form.watch("asset_id");

  const fetchImages = async () => {
    try {
      const res = await getALlImages();

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

  const previewUrl = images.find((img) => img.id === selectedId)?.value || "";

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

  const onSubmitUpdateProject = (data: TUpdateProjectFormValues) => {
    const dataToUpdate = (
      Object.keys(dirtyFields) as Array<keyof TUpdateProjectFormValues>
    ).reduce((acc, key) => {
      const currentValue = data[key];
      const defaultValue = defaultValues[key];

      if (!isEqual(currentValue, defaultValue)) {
        (acc as any)[key] = currentValue;
      }

      return acc;
    }, {} as Partial<TUpdateProjectFormValues>);

    if (Object.keys(dataToUpdate).length === 0) {
      return toast.info("No changes detected.");
    }


    startTransition(async () => {
      toast.promise(updateSelectedProject(project.slug, dataToUpdate), {
        loading: "Updating project...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.replace("/dashboard/projects"),
            message: "Project updated successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while updating project",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <Heading
            title="Project Details"
            description="Edit specific information about the project"
          />

          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmitUpdateProject)}
            className="flex flex-col gap-4"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                  <h3>{heading || "Untitled Project"}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormImage
                  className="w-full space-y-3"
                  name="asset_id"
                  control={form.control}
                  label="Thumbnail Image"
                  previewUrl={previewUrl}
                  required
                />
                <ImageDropdown
                  title="image"
                  options={images}
                  defaultValue={project.file_name}
                  onChange={(value) => {
                    setValue("asset_id", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  className="w-full"
                />
                <FormInput
                  className="w-full space-y-3"
                  control={form.control}
                  type="text"
                  name="title"
                  label="Title"
                  disabled={loading}
                  required
                  onChange={(e) => {
                    const newVal = e.target.value;
                    const generatedSlug = formatToSlug(newVal);

                    setHeading(newVal);

                    setValue("title", newVal, {
                      shouldValidate: true,
                    });

                    setValue("slug", generatedSlug, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
                <FormInput
                  className="w-full space-y-3"
                  control={form.control}
                  type="text"
                  name="slug"
                  label="Slug"
                  disabled
                />
                <FormTextarea
                  className="w-full space-y-3"
                  control={form.control}
                  name="description"
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
                  className="w-full space-y-3"
                  control={form.control}
                  name="overview"
                  label="Project Overview"
                  disabled={loading}
                  config={{
                    rows: 10,
                    showCharCount: false,
                  }}
                  required
                />
                <FormCombobox
                  className="w-full space-y-3"
                  control={form.control}
                  name="tech_stack"
                  label="Tech Stack"
                  options={techStack}
                  defaultSelected={project.tech_stack}
                  onCreate={(value) => handleCreateNew(value)}
                  disabled={loading}
                  required
                />
                <FormInputGroup
                  className="w-full space-y-3"
                  control={form.control}
                  name="urls"
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

            <Button
              disabled={loading}
              className="w-full text-white"
              type="submit"
            >
              {loading && <Spinner variant="circle" />}
              {loading ? "Updating..." : "Update"}
            </Button>
          </Form>
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default EditProject;
