"use client";

import {
  addNewTechStack,
  getAllAvailableTechStack,
} from "@/app/(dashboard)/lib/queries";
import { getAllImages } from "@/app/(dashboard)/lib/queries/assets/client";
import { updateSelectedProject } from "@/app/(dashboard)/lib/queries/projects/actions";
import { IProject } from "@/app/(dashboard)/types/data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { formatToSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { useRouter } from "next/navigation";
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
import PageContainer from "../../layout/page-container";
import ImageDropdown from "../../searchable-dropdown";
import { Value } from "platejs";
import { getTotalLength, hasPlateContent } from "@/lib/plate";
import { FormEditor } from "../../forms/form-editor";
import { PROJECT_STATUS, projectStatusKeys } from "./add-projects";
import { FormInputTag } from "../../forms/form-tag-input";
import { Tag } from "emblor";
import { FormSelect } from "../../forms/form-select";
import { capitalize } from "@/lib/helpers";
import { FormDate } from "../../forms/form-date";
import { FormCheck } from "../../forms/form-check";
import { addYears } from "date-fns";
import { useSessionClient } from "@/app/(dashboard)/hooks/use-session-client";

const UpdateProjectFormSchema = z
  .object({
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
      .custom<Value>()
      .refine(hasPlateContent, { message: "Project overview is required" })
      .refine(
        (val) => {
          return getTotalLength(val) >= 50;
        },
        { message: "Project overview is too short (min 50 chars)" },
      ),
    tech_stack: z
      .array(z.string().nonempty("Tech stack is required"))
      .min(3, "At least 3 must be selected"),
    roles: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
        }),
      )
      .min(1, "At least 1 must be chosen"),
    project_status: z.enum(projectStatusKeys, {
      error: "Please select a project status",
    }),
    start_date: z.coerce.date<Date>(),
    is_current: z.union([z.boolean(), z.string()]).nullable(),
    end_date: z.preprocess((val) => {
      if (!val) return null;
      return val;
    }, z.coerce.date().nullable()),
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
  })
  .refine(
    (data) => {
      if (data.is_current === true) return true;

      const projectStatus = data.project_status;
      const needsEndDate =
        projectStatus === PROJECT_STATUS.LIVE ||
        projectStatus === PROJECT_STATUS.ARCHIVED;

      if (needsEndDate) return data.end_date !== null;

      return true;
    },
    { message: "End date is required", path: ["end_date"] },
  );

export type TUpdateProjectFormValues = z.input<typeof UpdateProjectFormSchema>;

const EditProject = ({ project }: { project: IProject }) => {
  const { isAuthorized } = useSessionClient();
  const router = useRouter();

  const { title } = project;

  const [heading, setHeading] = useState(title);
  const [loading, startTransition] = useTransition();
  const [images, setImages] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  const defaultValues = {
    ...project,
    start_date: new Date(project.start_date),
    end_date: project.end_date ? new Date(project.end_date) : null,
    is_current: !!project.is_current,
  };

  const form = useForm<TUpdateProjectFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(UpdateProjectFormSchema),
    defaultValues,
  });

  const {
    setValue,
    formState: { dirtyFields },
    watch,
  } = form;

  const selectedId = watch("asset_id");
  const isChecked = watch("is_current");
  const currentStartDate = watch("start_date");

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

  const [roleTags, setRoleTags] = useState<Tag[]>(defaultValues.roles);
  const [activeRoleTagIndex, setActiveRoleTagIndex] = useState<number | null>(
    null,
  );

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
    <PageContainer
      pageTitle="Project Details"
      pageDescription="Edit specific information about the project"
      scrollable
    >
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
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
                  className="w-full"
                  name="asset_id"
                  control={form.control}
                  label="Thumbnail Image"
                  previewUrl={previewUrl}
                  required
                />
                <ImageDropdown
                  item="image"
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
                <div className="grid-cols grid items-start gap-4 md:grid-cols-[2fr_1fr]">
                  <FormInput
                    className="w-full"
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
                  <FormSelect
                    control={form.control}
                    name="project_status"
                    label="Project Status"
                    options={projectStatusKeys.map((key) => {
                      const label = key.includes("_")
                        ? key
                            .split("_")
                            .map((word) => capitalize(word))
                            .join(" ")
                        : key;

                      return {
                        label: `${capitalize(label)}`,
                        value: key,
                      };
                    })}
                    className="w-full"
                    disabled={loading}
                    onChange={(value) => {
                      if (value === "under_development") {
                        setValue("end_date", null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setValue("is_current", true, {
                          shouldValidate: true,
                        });
                      } else {
                        setValue(
                          "end_date",
                          project.end_date ? new Date(project.end_date) : null,
                        );
                        setValue("is_current", false, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    required
                  />
                </div>
                <FormInput
                  className="w-full"
                  control={form.control}
                  type="text"
                  name="slug"
                  label="Slug"
                  disabled
                />
                <FormTextarea
                  className="w-full"
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
                <FormEditor
                  className="w-full"
                  control={form.control}
                  name="overview"
                  label="Project Overview"
                  disabled={loading}
                  required
                />
                <FormCombobox
                  className="w-full"
                  control={form.control}
                  name="tech_stack"
                  label="Tech Stack"
                  options={techStack}
                  defaultSelected={project.tech_stack}
                  onCreate={(value) => handleCreateNew(value)}
                  disabled={loading}
                  required
                />
                <FormInputTag
                  className="w-full"
                  control={form.control}
                  name="roles"
                  label="Roles"
                  placeholder="Add a role"
                  tags={roleTags}
                  setTags={(newTags) => {
                    setRoleTags(newTags);
                    setValue("roles", newTags as [Tag, ...Tag[]]);
                  }}
                  activeTagIndex={activeRoleTagIndex}
                  setActiveTagIndex={setActiveRoleTagIndex}
                  config={{
                    shape: "rounded",
                    size: "sm",
                    textCase: "capitalize",
                    interaction: "clickable",
                    maxTags: 5,
                    styleClasses: {
                      inlineTagsContainer: "dark:bg-input/30",
                      input: "outline-none border-none shadow-none w-full",
                      tag: {
                        closeButton: "cursor-pointer",
                      },
                    },
                  }}
                  disabled={loading}
                  required
                />
                <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2">
                  <FormDate
                    control={form.control}
                    name="start_date"
                    label="Start Date"
                    className="w-full"
                    disabled={loading}
                    config={{
                      startMonth: defaultValues.start_date,
                      disabledDateRules: (date) => date > new Date(),
                    }}
                    required
                  />
                  <FormDate
                    control={form.control}
                    name="end_date"
                    label="End Date"
                    className="w-full"
                    disabled={loading}
                    config={{
                      ...(isChecked && { placeholder: "Present" }),
                      startMonth: defaultValues.start_date ?? undefined,
                      endMonth: defaultValues.start_date
                        ? addYears(defaultValues.start_date, 10)
                        : undefined,
                      defaultMonth: defaultValues.start_date ?? undefined,
                      disabledDateRules: (date) =>
                        date <= defaultValues.start_date,
                      disabledState: isChecked as boolean,
                    }}
                    required
                  />
                  <FormCheck
                    control={form.control}
                    name="is_current"
                    label="I'm currently working on this project"
                    onChange={(checked) => {
                      if (checked) {
                        setValue("end_date", null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });

                        setValue("project_status", "under_development", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      } else {
                        setValue("project_status", "live", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setValue(
                          "end_date",
                          project.end_date ? new Date(project.end_date) : null,
                        );
                      }
                    }}
                    disabled={loading}
                  />
                </div>
                <FormInputGroup
                  className="grid w-full gap-3"
                  control={form.control}
                  name="urls"
                  label="URLs"
                  inputs={{
                    github: {
                      name: "urls.github",
                      label: "Source Code",
                      icon: <Icons.github className="size-5" />,
                    },
                    demo: {
                      name: "urls.demo",
                      label: "Demo",
                      icon: <Icons.home className="size-5" />,
                    },
                  }}
                  disabled={loading}
                />
              </CardContent>
            </Card>

            <Button disabled={loading} className="w-full" type="submit">
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
