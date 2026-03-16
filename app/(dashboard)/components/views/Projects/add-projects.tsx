"use client";

import { useSessionClient } from "@/app/(dashboard)/hooks/use-session-client";
import {
  addNewTechStack,
  getAllAvailableTechStack,
} from "@/app/(dashboard)/lib/queries";
import { getAllImages } from "@/app/(dashboard)/lib/queries/assets/client";
import { bulkAddProject } from "@/app/(dashboard)/lib/queries/projects/actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { getTotalLength, hasPlateContent } from "@/lib/plate";
import { cn, formatToSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Value } from "platejs";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import FormCardSkeleton from "../../form-card-skeleton";
import { FormCombobox } from "../../forms/form-combobox";
import { FormEditor } from "../../forms/form-editor";
import { FormImage } from "../../forms/form-image";
import { FormInput } from "../../forms/form-input";
import { FormInputGroup } from "../../forms/form-input-group";
import { FormTextarea } from "../../forms/form-textarea";
import PageContainer from "../../layout/page-container";
import ImageDropdown from "../../searchable-dropdown";
import { Tag } from "emblor";
import { FormInputTag } from "../../forms/form-tag-input";
import { FormSelect } from "../../forms/form-select";
import { capitalize } from "@/lib/helpers";
import { FormDate } from "../../forms/form-date";
import { FormCheck } from "../../forms/form-check";
import { addYears } from "date-fns";

export const PROJECT_STATUS = {
  LIVE: "live",
  UNDER_DEVELOPMENT: "under_development",
  ARCHIVED: "archived",
} as const;

export const projectStatusKeys = Object.values(PROJECT_STATUS) as [
  string,
  ...string[],
];

const SingleProjectSchema = z
  .object({
    thumbnail: z.string().nonempty("Please select an image"),
    title: z.string().trim().nonempty("Project title is required"),
    slug: z.string().trim().nonempty("Slug is required"),
    overview: z
      .custom<Value>()
      .refine(hasPlateContent, { message: "Project overview is required" })
      .refine(
        (val) => {
          return getTotalLength(val) >= 50;
        },
        { message: "Project overview is too short (min 50 chars)" },
      ),
    description: z
      .string()
      .trim()
      .nonempty("Project description is required")
      .min(25, "Project description must be at least 25 characters long."),
    tech_stack: z
      .array(z.string().nonempty("Please select at least one tech stack"))
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
    start_date: z
      .date()
      .nullable()
      .refine((val) => val !== null, "Start date is required"),
    is_current: z.union([z.boolean(), z.string()]).nullable(),
    end_date: z.date().nullable(),
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

const AddProjectsFormSchema = z.object({
  projects: z.array(SingleProjectSchema),
});

export type TAddProjectsFormValues = z.input<typeof AddProjectsFormSchema>;

const AddProjects = () => {
  const { isAuthorized } = useSessionClient();
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
        overview: [{ type: "p", children: [{ text: "" }] }],
        tech_stack: [],
        roles: [],
        project_status: "",
        start_date: null,
        is_current: false,
        end_date: null,
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

  const [roleTags, setRoleTags] = useState<Tag[]>(
    defaultValues.projects[0].roles,
  );
  const [activeRoleTagIndex, setActiveRoleTagIndex] = useState<number | null>(
    null,
  );

  const onSubmit = (data: TAddProjectsFormValues) => {
    startTransition(async () => {
      toast.promise(bulkAddProject(data.projects), {
        loading: "Adding project...",
        success: () => {
          const count = data.projects.length;
          const message =
            count > 1
              ? "All projects added successfully"
              : "Project added successfully";
          return {
            duration: 1500,
            onAutoClose: () => router.replace("/dashboard/projects"),
            message,
          };
        },
        error: (error: Error) => {
          return {
            message: "Error saving project",
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

              const currentSelectedStartDate = watchedProjects?.[index]
                ?.start_date as Date;

              const isStillWorkingOnProject = watchedProjects?.[index]
                ?.is_current as boolean;

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
                        rows: 10,
                        showCharCount: false,
                      }}
                      required
                    />
                    <FormEditor
                      className="w-full"
                      control={form.control}
                      name={`projects.${index}.overview`}
                      label="Project Overview"
                      disabled={loading}
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
                    <div className="grid-cols grid items-start gap-4 md:grid-cols-[2fr_1fr]">
                      <FormInputTag
                        className="w-full"
                        control={form.control}
                        name={`projects.${index}.roles`}
                        label="Roles"
                        placeholder="Add a role"
                        tags={roleTags}
                        setTags={(newTags) => {
                          setRoleTags(newTags);
                          setValue(
                            `projects.${index}.roles`,
                            newTags as [Tag, ...Tag[]],
                          );
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
                            inlineTagsContainer: "dark:bg-input/30 mb-2",
                            input:
                              "outline-none border-none shadow-none w-full",
                            tag: {
                              closeButton: "cursor-pointer",
                            },
                          },
                        }}
                        disabled={loading}
                        required
                      />
                      <FormSelect
                        control={form.control}
                        name={`projects.${index}.project_status`}
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
                            setValue(`projects.${index}.end_date`, null, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setValue(`projects.${index}.is_current`, true, {
                              shouldValidate: true,
                            });
                          } else {
                            setValue(`projects.${index}.is_current`, false, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2">
                      <FormDate
                        control={form.control}
                        name={`projects.${index}.start_date`}
                        label="Start Date"
                        className="w-full"
                        disabled={loading}
                        config={{
                          startMonth: new Date(2019, 0),
                          disabledDateRules: (date) => date > new Date(),
                        }}
                        required
                      />
                      <FormDate
                        control={form.control}
                        name={`projects.${index}.end_date`}
                        label="End Date"
                        className="w-full"
                        disabled={loading}
                        config={{
                          ...(isStillWorkingOnProject && {
                            placeholder: "Present",
                          }),
                          startMonth: currentSelectedStartDate,
                          endMonth: addYears(currentSelectedStartDate, 10),
                          defaultMonth: currentSelectedStartDate,
                          disabledDateRules: (date) =>
                            date <= currentSelectedStartDate,
                          disabledState: isStillWorkingOnProject,
                        }}
                        required
                      />
                      <FormCheck
                        control={form.control}
                        name={`projects.${index}.is_current`}
                        label="I'm currently working on this project"
                        onChange={(checked) => {
                          if (checked) {
                            setValue(`projects.${index}.end_date`, null, {
                              shouldValidate: true,
                            });

                            setValue(
                              `projects.${index}.project_status`,
                              "under_development",
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              },
                            );
                          } else {
                            setValue(
                              `projects.${index}.project_status`,
                              "live",
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              },
                            );
                          }
                        }}
                        disabled={loading}
                      />
                    </div>
                    <FormInputGroup
                      className="w-full space-y-3"
                      control={form.control}
                      name={`projects.${index}.urls`}
                      label="URLs"
                      inputs={{
                        github: {
                          name: `projects.${index}.urls.github`,
                          label: "Source Code",
                          icon: <Icons.github className="size-5" />,
                        },
                        demo: {
                          name: `projects.${index}.urls.demo`,
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
            <Button
              disabled={loading || !isAuthorized}
              className="w-full"
              type="submit"
            >
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
