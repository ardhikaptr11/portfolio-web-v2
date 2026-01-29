"use client";

import {
  batchUploadAssets,
  uploadSingleImage,
} from "@/app/(dashboard)/lib/queries/assets/client";
import { AssetsUploadConfig } from "@/app/(dashboard)/types/base-form";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormUploadImages } from "../../forms/form-upload-images";
import PageContainer from "../../layout/page-container";
import { FormUploadFiles } from "../../forms/form-upload.files";
import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
  MAX_TOTAL_FILE,
  MAX_UPLOAD_FILE,
} from "@/app/(dashboard)/constants/items.constants";
import { getTotalAssets } from "@/app/(dashboard)/lib/queries/assets/client";

const UploadImageFormSchema = z
  .object({
    isBatchUploadEnabled: z.boolean().default(true).optional(),
    images: z.array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Max size 5MB")
        .refine(
          (file) => ACCEPTED_TYPES.image.includes(file.type),
          "Unsupported file type",
        ),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.isBatchUploadEnabled && data.images.length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "Please select at least 2 images",
        path: ["images"],
      });
    }
  });

type TUploadImage = z.infer<typeof UploadImageFormSchema>;

const UploadFileFormSchema = z.object({
  files: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Max size 5MB")
        .refine(
          (file) => ACCEPTED_TYPES.file.includes(file.type),
          "Unsupported file type",
        ),
    )
    .min(2, "Please select at least 2 files"),
});

type TUploadFile = z.infer<typeof UploadFileFormSchema>;

const UploadAssets = () => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const [isBatchUploadEnabled, setIsBatchUploadEnabled] =
    useState<boolean>(true);
  const [mode, setMode] = useState<string>("Batch Upload");
  const [status, setStatus] = useState<string>("Enabled");

  const [imageUploadConfig, setImageUploadConfig] =
    useState<AssetsUploadConfig>({
      accept: ACCEPTED_TYPES.image,
      maxSize: MAX_FILE_SIZE,
      maxFiles: MAX_UPLOAD_FILE.image,
    });

  const fileUploadConfig = {
    accept: ACCEPTED_TYPES.file,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_UPLOAD_FILE.file,
  };

  const [totalImageAssets, setTotalImageAssets] = useState<number | null>(0);
  const [totalFileAssets, setTotalFileAssets] = useState<number | null>(0);

  const getAssetsCount = async () => {
    try {
      const { totalImageAssets, totalFileAssets } = await getTotalAssets();
      setTotalImageAssets(totalImageAssets);
      setTotalFileAssets(totalFileAssets);
    } catch (error) {
      toast.error("Error fetching total assets", {
        description: (error as Error).message,
      });
    }
  };

  useEffect(() => {
    getAssetsCount();
  }, []);

  const uploadImageForm = useForm<TUploadImage>({
    mode: "onSubmit",
    resolver: zodResolver(UploadImageFormSchema),
    defaultValues: {
      images: [],
    },
  });

  const { setValue } = uploadImageForm;

  const uploadFileForm = useForm<TUploadFile>({
    mode: "onSubmit",
    resolver: zodResolver(UploadFileFormSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmitUploadImages = (data: TUploadImage) => {
    if (totalImageAssets === MAX_TOTAL_FILE.image + 1) {
      toast.info("Maximum limit of image assets reached", {
        description: "Free up some space by deleting unused images.",
        action: (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={(e) => {
              e.preventDefault();
              router.push("/dashboard/assets/library");
            }}
          >
            <span>View</span>
            <Icons.arrowRight />
          </Button>
        ),
      });
    }

    startTransition(async () => {
      try {
        isBatchUploadEnabled
          ? await batchUploadAssets(data.images)
          : await uploadSingleImage(data.images);

        toast.success("All image(s) successfully uploaded");
        router.push("/dashboard/assets");
      } catch (err) {
        toast.error("Error while uploading", {
          description: (err as Error).message,
        });
      }
    });
  };

  const onSubmitUploadFiles = (data: TUploadFile) => {
    if (totalFileAssets === MAX_TOTAL_FILE.file) {
      toast.info("Maximum limit for file assets reached", {
        description: "Free up some space by deleting unused files.",
        action: (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={(e) => {
              e.preventDefault();
              router.push("/dashboard/assets/library?category=file");
            }}
          >
            <span>View</span>
            <Icons.arrowRight />
          </Button>
        ),
      });
    }

    startTransition(async () => {
      try {
        await batchUploadAssets(data.files);

        toast.success("All files successfully uploaded");
        router.push("/dashboard/assets");
      } catch (err) {
        toast.error("Error while uploading", {
          description: (err as Error).message,
        });
      }
    });
  };

  return (
    <PageContainer scrollable>
      <Tabs defaultValue="image">
        <TabsList className="mb-0!">
          <TabsTrigger value="image" className="cursor-pointer">
            Image
          </TabsTrigger>
          <TabsTrigger value="file" className="cursor-pointer">
            File
          </TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <div className="flex items-center justify-between">
                <CardDescription>
                  Upload images to your asset library for content use on the
                  site.
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="upload-mode"
                    checked={isBatchUploadEnabled}
                    onCheckedChange={() => {
                      setIsBatchUploadEnabled((prev) => !prev);

                      if (isBatchUploadEnabled) {
                        setStatus("Disabled");
                        setMode("Single Upload");
                        setImageUploadConfig((prev) => ({
                          ...prev,
                          maxFiles: 1,
                          multiple: false,
                        }));
                        setValue("isBatchUploadEnabled", false);
                      } else {
                        setStatus("Enabled");
                        setMode("Batch Upload");
                        setImageUploadConfig((prev) => ({
                          ...prev,
                          maxFiles: 10,
                          multiple: true,
                        }));
                        setValue("isBatchUploadEnabled", true);
                      }
                    }}
                  />
                  <Label htmlFor="upload-mode">{status}</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <Form
                form={uploadImageForm}
                onSubmit={uploadImageForm.handleSubmit(onSubmitUploadImages)}
                className="flex flex-col gap-4"
              >
                <FormUploadImages
                  label={mode}
                  name="images"
                  control={uploadImageForm.control}
                  className="w-full gap-3"
                  config={imageUploadConfig}
                  disabled={loading}
                  required
                />
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>
                Upload files to your asset library for content use on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <Form
                form={uploadFileForm}
                onSubmit={uploadFileForm.handleSubmit(onSubmitUploadFiles)}
                className="flex flex-col gap-4"
              >
                <FormUploadFiles
                  label="Upload Files"
                  name="files"
                  control={uploadFileForm.control}
                  className="w-full gap-3"
                  config={fileUploadConfig}
                  disabled={loading}
                  required
                />
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default UploadAssets;
