"use client";

import PageContainer from "../../layout/page-container";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { FormInput } from "../../forms/form-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FormTextarea } from "../../forms/form-textarea";
import { useState, useTransition } from "react";
import { Tag } from "emblor";
import { FormInputTag } from "../../forms/form-tag-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/(dashboard)/lib/queries/user";
import { IProfile } from "@/app/(dashboard)/types/user";
import { FormAvatarUpload } from "../../forms/form-avatar";
import FileUploadCompact from "@/components/file-upload-compact";
import { FormFileUpload } from "../../forms/form-file";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { FormInputGroup } from "../../forms/form-input-group";

// import {
//   getDecryptedPassword,
//   Profile,
//   updateUserProfile,
// } from "@/app/dashboard/users/profile/actions";
// import { FormInputPassword } from "../../forms/form-input-password";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { Spinner } from "@/components/ui/spinner";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { formatDate } from "@/lib/format";
// import { cn } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import * as z from "zod";

const ACCEPTED_TYPES = {
  image: "image/jpeg, image/jpg, image/png, image/webp",
  file: "application/pdf",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const FormSchema = z.object({
  avatar: z
    .union([
      z.string(),
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Max size 2MB")
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
  tagline: z
    .string()
    .trim()
    .nonempty("Tagline cannot be empty")
    .min(5, "Fill in with at least 5 characters"),
  biography: z
    .string()
    .trim()
    .nonempty("Biography cannot be empty")
    .min(10, "Fill in with at least 10 characters"),
  roles: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(3, "At least 3 must be selected"),
  skills: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(5, "At least 5 must be selected"),
  social_links: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    threads: z.string().optional(),
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
    avatar: profile.avatar_url || "",
    name: profile.name || "",
    tagline: profile.tagline || "",
    biography: profile.biography || "",
    roles: profile.roles || [],
    skills: profile.skills || [],
    social_links: {
      github: profile.social_links?.github.split("/").at(-1) || "",
      linkedin: profile.social_links?.linkedin.split("/").at(-1) || "",
      threads: profile.social_links?.threads.split("/").at(-1) || "",
    },
    cv: profile.cv_url || "",
  };

  const form = useForm<TUpdateProfile>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const [roleTags, setRoleTags] = useState<Tag[]>(defaultValues.roles);
  const [skillTags, setSkillTags] = useState<Tag[]>(defaultValues.skills);
  const [activeRoleTagIndex, setActiveRoleTagIndex] = useState<number | null>(
    null,
  );
  const [activeSkillTagIndex, setActiveSkillTagIndex] = useState<number | null>(
    null,
  );

  const { setValue } = form;

  const onSubmit = (data: TUpdateProfile) => {
    const modifiedData = {
      ...data,
      social_links: {
        github: `https://github.com/${data.social_links.github}`,
        linkedin: `https://linkedin.com/in/${data.social_links.linkedin}`,
        threads: `https://threads.com/${data.social_links.threads}`,
      },
    };
    console.log(modifiedData);

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

    if (JSON.stringify(data) === JSON.stringify(defaultValues)) {
      return toast.warning("Cannot update profile", {
        description: "No changes has been made",
      });
    }

    startTransition(async () => {
      const res = await updateProfile(data);

      if (res.error) {
        toast.error("Failed to update profile", {
          position: "top-right",
          description: res.error,
        });
      } else {
        toast.success("Profile successfully updated", {
          position: "top-right",
        });

        form.reset();

        setResetKey((prev) => prev + 1);
        router.refresh();
      }
    });
  };

  return (
    <PageContainer scrollable={false}>
      <Card className="no-scrollbar mx-auto max-h-130 w-full max-w-3xl overflow-y-auto">
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
                  acceptedTypes: ACCEPTED_TYPES.image,
                }}
                defaultAvatar={defaultValues.avatar}
              />
              <div className="mt-2 flex-center w-full max-w-25 space-x-2">
                {defaultValues.social_links.github && (
                  <Link
                    href={
                      defaultValues.social_links.github.includes("https")
                        ? defaultValues.social_links.github
                        : `https://github.com/${defaultValues.social_links.github}`
                    }
                    className="hover:animate-pulse"
                    rel="noreferrer noopener"
                  >
                    <Icons.github className="size-6" />
                  </Link>
                )}
                {defaultValues.social_links.linkedin && (
                  <Link
                    href={
                      defaultValues.social_links.linkedin.includes("https")
                        ? defaultValues.social_links.linkedin
                        : `https://linkedin.com/in/${defaultValues.social_links.linkedin}`
                    }
                    className="hover:animate-pulse"
                    rel="noreferrer noopener"
                  >
                    <Icons.linkedin className="size-6" />
                  </Link>
                )}
                {defaultValues.social_links.threads && (
                  <Link
                    href={
                      defaultValues.social_links.threads.includes("https")
                        ? defaultValues.social_links.threads
                        : `https://threads.com/${defaultValues.social_links.threads}`
                    }
                    className="hover:animate-pulse"
                    rel="noreferrer noopener"
                  >
                    <Icons.threads className="size-6" />
                  </Link>
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
            <FormTextarea
              className="w-full gap-3"
              control={form.control}
              name="biography"
              label="Biography"
              required
              config={{
                maxLength: 500,
                resize: "none",
              }}
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
            <FormInputTag
              className="w-full gap-3"
              control={form.control}
              name="skills"
              label="Skills"
              placeholder="Add a skill"
              tags={skillTags}
              setTags={(newTags) => {
                setSkillTags(newTags);
                setValue("skills", newTags as [Tag, ...Tag[]]);
              }}
              activeTagIndex={activeSkillTagIndex}
              setActiveTagIndex={setActiveSkillTagIndex}
              config={{
                shape: "rounded",
                size: "sm",
                interaction: "clickable",
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
            <FormInputGroup
              className="grid w-full gap-3"
              control={form.control}
              name="social_links"
              label="Social Links"
              inputs={{
                github: {
                  icon: <Icons.github className="size-5" />,
                  disabled: loading,
                },
                linkedin: {
                  icon: <Icons.linkedin className="size-5" />,
                  disabled: loading,
                },
                threads: {
                  icon: <Icons.threads className="size-5" />,
                  disabled: loading,
                },
              }}
            />
            <FormFileUpload
              key={`cv-upload-${resetKey}`}
              className="w-full gap-3"
              control={form.control}
              name="cv"
              label="CV (Curriculum Vitae)"
              defaultFile={defaultValues.cv}
              config={{
                acceptedTypes: ACCEPTED_TYPES.file,
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
              className={cn("mt-2 ml-auto w-full cursor-pointer", {
                "flex gap-1": loading,
              })}
              type="submit"
            >
              {loading ? <Spinner variant="circle" /> : "Save Changes"}
            </Button>
          </Form>
        </CardContent>
      </Card>
      {/* <Tabs className="mx-auto w-full max-w-3xl gap-y-8"> */}
      {/* <TabsContent value="account">
        </TabsContent> */}
      {/* <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Ubah password akun Anda di sini.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <Form
                form={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormInputPassword
                  className="w-full"
                  control={form.control}
                  type={showPassword.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  label="Password Saat Ini"
                  showPassword={showPassword.currentPassword}
                  setShowPassword={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      currentPassword: !prev.currentPassword,
                    }))
                  }
                  disabled={loading}
                  required
                />
                <FormInputPassword
                  control={form.control}
                  type={showPassword.newPassword ? "text" : "password"}
                  name="newPassword"
                  label="Password Baru"
                  showPassword={showPassword.newPassword}
                  setShowPassword={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      newPassword: !prev.newPassword,
                    }))
                  }
                  required
                  disabled={loading}
                />
                <Button
                  disabled={loading}
                  className={cn("mt-2 ml-auto w-full cursor-pointer", {
                    "flex gap-1": loading,
                  })}
                  type="submit"
                >
                  {loading ? <Spinner variant="circle" /> : "Simpan"}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent> */}
      {/* </Tabs> */}
    </PageContainer>
  );
};

export default ProfileInfo;
