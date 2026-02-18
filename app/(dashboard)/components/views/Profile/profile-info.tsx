"use client";

import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
} from "@/app/(dashboard)/constants/items.constants";
import { updateProfile } from "@/app/(dashboard)/lib/queries/user/actions";
import { IProfile } from "@/app/(dashboard)/types/user";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "emblor";
import { isEqual } from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormAvatarUpload } from "../../forms/form-avatar";
import { FormFileUpload } from "../../forms/form-file";
import { FormInput } from "../../forms/form-input";
import { FormInputGroup } from "../../forms/form-input-group";
import { FormInputTag } from "../../forms/form-tag-input";
import { FormTextarea } from "../../forms/form-textarea";
import PageContainer from "../../layout/page-container";
import { FormCombobox } from "../../forms/form-combobox";
import {
  addNewTechStack,
  getAllAvailableTechStack,
} from "@/app/(dashboard)/lib/queries";

const FormSchema = z.object({
  avatar: z
    .union([
      z.string(),
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Max size 5MB")
        .refine(
          (file) => ACCEPTED_TYPES["image"].includes(file.type),
          "Unsupported file type",
        ),
    ])
    .nullable()
    .optional(),
  name: z
    .string()
    .trim()
    .nonempty("Name cannot be empty")
    .min(2, "Fill in with at least two characters"),
  motto: z
    .string()
    .trim()
    .nonempty("Motto cannot be empty")
    .min(10, "Fill in with at least 10 characters"),
  tagline: z
    .string()
    .trim()
    .nonempty("Tagline cannot be empty")
    .min(5, "Fill in with at least 5 characters"),
  roles: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(3, "At least 3 must be selected"),
  skills: z
    .array(z.string().nonempty("Skills is required"))
    .min(3, "At least 3 must be selected"),
  social_links: z.object({
    github: z.union([
      z.literal(""),
      z.string(),
      z
        .string()
        .regex(
          /^(https:\/\/)?(www\.)?github\.com\/\S+$/i,
          "Invalid GitHub URL",
        ),
    ]),
    linkedin: z.union([
      z.literal(""),
      z.string(),
      z
        .string()
        .regex(
          /^(https:\/\/)?(www\.)?linkedin\.com\/in\/\S+$/i,
          "Invalid LinkedIn URL",
        ),
    ]),
    threads: z.union([
      z.literal(""),
      z.string(),
      z
        .string()
        .regex(
          /^(https:\/\/)?(www\.)?linkedin\.com\/in\/\S+$/i,
          "Invalid Threads URL",
        ),
    ]),
  }),
  cv: z
    .union([
      z.string(),
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Max size 2MB")
        .refine(
          (file) => file.type === "application/pdf",
          "Unsupported file type",
        ),
    ])
    .nullable()
    .optional(),
});

export type TUpdateProfile = z.infer<typeof FormSchema>;

const ProfileInfo = ({ profile }: { profile: IProfile }) => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const [resetKey, setResetKey] = useState(0);

  const defaultValues = {
    avatar: profile.avatar.url || "",
    name: profile.name || "",
    motto: profile.motto || "",
    tagline: profile.tagline || "",
    roles: profile.roles || [],
    skills: profile.skills || [],
    social_links: {
      github: profile.social_links?.github.split("/").at(-1) || "",
      linkedin: profile.social_links?.linkedin.split("/").at(-1) || "",
      threads: profile.social_links?.threads.split("/").at(-1) || "",
    },
    cv: profile.cv.url || "",
  };

  const form = useForm<TUpdateProfile>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const [techStack, setTechStack] = useState<string[]>([]);

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

  const [roleTags, setRoleTags] = useState<Tag[]>(defaultValues.roles);
  const [activeRoleTagIndex, setActiveRoleTagIndex] = useState<number | null>(
    null,
  );

  const {
    setValue,
    formState: { dirtyFields },
  } = form;

  const onSubmit = (data: TUpdateProfile) => {
    if (!data.avatar) {
      return toast.warning("Avatar is required", {
        description: "Please upload an image for your profile",
      });
    }

    if (!data.cv) {
      return toast.warning("CV is required", {
        description: "Please upload your CV",
      });
    }

    const dataToUpdate = (
      Object.keys(dirtyFields) as Array<keyof TUpdateProfile>
    ).reduce((acc, key) => {
      const currentValue = data[key];
      const defaultValue = defaultValues[key];

      if (!isEqual(currentValue, defaultValue)) {
        (acc as any)[key] = currentValue;
      }

      return acc;
    }, {} as Partial<TUpdateProfile>);

    if (Object.keys(dataToUpdate).length === 0) {
      return toast.info("No changes detected.");
    }

    startTransition(async () => {
      try {
        await updateProfile(dataToUpdate);
        toast.success("Profile successfully updated", {
          position: "top-right",
        });

        form.reset();

        setResetKey((prev) => prev + 1);
        router.refresh();
      } catch (error) {
        toast.error("Failed to update profile", {
          position: "top-right",
          description: (error as Error).message,
        });
      }
    });
  };

  return (
    <PageContainer scrollable={false}>
      <div className="mx-auto w-full max-w-3xl">
        <Card className="no-scrollbar max-h-145 overflow-y-auto">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              You can manage your profile here to be displayed on the landing
              page.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Form
              form={form}
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex-col-center">
                <FormAvatarUpload
                  control={form.control}
                  name="avatar"
                  config={{
                    maxSize: MAX_FILE_SIZE,
                    accept: ACCEPTED_TYPES.image,
                  }}
                  defaultAvatar={defaultValues.avatar}
                />
                <div className="mt-2 flex-center w-full max-w-25 space-x-2">
                  {Object.entries(defaultValues.social_links).map(
                    ([key, value]) => {
                      const Icon = Icons[key as keyof typeof Icons];
                      const params = (key === "linkedin" && "in/") || "";

                      return (
                        <Link
                          key={key}
                          href={
                            value.includes("https")
                              ? value
                              : `https://${key}.com/${params}${value}`
                          }
                          className="hover:animate-pulse"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <Icon className="size-6" />
                        </Link>
                      );
                    },
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FormInput
                  className="w-full gap-3"
                  control={form.control}
                  type="text"
                  name="name"
                  label="Name"
                  disabled={loading}
                  required
                />
                <div className="grid w-full gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    autoComplete="email"
                    defaultValue={profile.email}
                    disabled
                  />
                </div>
              </div>
              <FormInput
                className="w-full gap-3"
                control={form.control}
                type="text"
                name="tagline"
                label="Tagline"
                disabled={loading}
                required
              />
              <FormInput
                className="w-full gap-3"
                control={form.control}
                name="motto"
                label="Motto"
                required
              />
              <FormInputTag
                className="w-full gap-3"
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
                    inlineTagsContainer: "dark:bg-input/30 mb-2",
                    input: "outline-none border-none shadow-none w-full",
                    tag: {
                      closeButton: "cursor-pointer",
                    },
                  },
                }}
                disabled={loading}
                required
              />
              <FormCombobox
                className="w-full"
                control={form.control}
                name="skills"
                label="Skills"
                options={techStack}
                defaultSelected={profile.skills}
                onCreate={(value) => handleCreateNew(value)}
                disabled={loading}
                required
              />
              <FormInputGroup
                className="grid w-full gap-3"
                control={form.control}
                name="social_links"
                label="Social Links"
                inputs={{
                  github: {
                    label: "GitHub",
                    icon: <Icons.github className="size-5" />,
                  },
                  linkedin: {
                    label: "LinkedIn",
                    icon: <Icons.linkedin className="size-5" />,
                  },
                  threads: {
                    label: "Threads",
                    icon: <Icons.threads className="size-5" />,
                  },
                }}
                disabled={loading}
              />
              <FormFileUpload
                key={`cv-upload-${resetKey}`}
                className="w-full gap-3"
                control={form.control}
                name="cv"
                label="CV (Curriculum Vitae)"
                defaultFile={defaultValues.cv}
                config={{
                  accept: ACCEPTED_TYPES.file,
                  maxSize: MAX_FILE_SIZE,
                }}
                {...(defaultValues.cv
                  ? {
                      description:
                        "You cannot delete existing file, but you can still replace the current file.",
                    }
                  : {})}
                required
              />
              <Button
                disabled={loading}
                className={cn("mt-2 ml-auto w-full space-x-1", {
                  "flex gap-1": loading,
                })}
                type="submit"
              >
                {loading && <Spinner variant="circle" />}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ProfileInfo;
