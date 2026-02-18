"use client";

import { getAllAssets } from "@/app/(dashboard)/lib/queries/assets/actions";
import { IExperience } from "@/app/(dashboard)/types/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { capitalize } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears } from "date-fns";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import FormCardSkeleton from "../../form-card-skeleton";
import { FormCheck } from "../../forms/form-check";
import { FormDate } from "../../forms/form-date";
import { FormDropdown } from "../../forms/form-dropdown";
import { FormInput } from "../../forms/form-input";
import { FormSelect } from "../../forms/form-select";
import ResponsibilityInputList from "../../input-list";
import PageContainer from "../../layout/page-container";
import { isEqual } from "lodash";
import { updateSelectedExperience } from "@/app/(dashboard)/lib/queries/experiences/action";

const WORK_TYPE = {
  ONLINE: "online",
  OFFLINE: "offline",
} as const;

const WORK_CATEGORY = {
  FULL_TIME: "full_time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

const workTypeKeys = Object.values(WORK_TYPE) as [string, ...string[]];
const workCategoryKeys = Object.values(WORK_CATEGORY) as [string, ...string[]];

// role, organization, category, work_type, responsibilities, location, start_date, end_date, is_current, related_asset
const UpdateExperienceFormSchema = z
  .object({
    role: z.string().trim().nonempty("Role is required"),
    organization: z.string().trim().nonempty("Organization is required"),
    location: z.string().trim().nonempty("Location is required"),
    work_type: z.enum(workTypeKeys, { error: "Please select a work type" }),
    work_category: z.enum(workCategoryKeys, {
      error: "Please select a work category",
    }),
    responsibilities: z.array(
      z.string().trim().nonempty("Responsibility cannot be empty"),
    ),
    start_date: z.coerce.date<Date>(),
    is_current: z.union([z.boolean(), z.string()]).nullable(),
    end_date: z.preprocess((val) => {
      if (!val) return null;
      return val;
    }, z.coerce.date().nullable()),
    related_asset: z.string().nullable(),
  })
  .refine((data) => (data.is_current ? true : !!data.end_date), {
    message: "End date is required",
    path: ["end_date"],
  });

export type TUpdateExperienceFormValues = z.input<
  typeof UpdateExperienceFormSchema
>;

const EditExperience = ({ experience }: { experience: IExperience }) => {
  const router = useRouter();

  const [heading, setHeading] = useState(experience.role);

  const [loading, startTransition] = useTransition();
  const [assets, setAssets] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const fetchAssets = async () => {
    try {
      const { files, images } = await getAllAssets();

      const assets = [...files, ...images].map((asset) => ({
        id: asset.id,
        label: asset.file_name,
        value: asset.url,
      }));
      setAssets(assets);
    } catch (error) {
      toast.error("Failed to fetch assets", {
        description: (error as Error).message,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const { file_name, ...rest } = experience;

  const defaultValues = {
    ...rest,
    start_date: new Date(experience.start_date),
    end_date: experience.end_date ? new Date(experience.end_date) : null,
    is_current: !!experience.is_current,
  };

  const form = useForm<TUpdateExperienceFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(UpdateExperienceFormSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    formState: { dirtyFields, errors },
  } = form;

  const isChecked = watch("is_current");
  const currentStartDate = watch("start_date");

  const onSubmitUpdateExperience = (data: TUpdateExperienceFormValues) => {
    const dataToUpdate = (
      Object.keys(dirtyFields) as Array<keyof TUpdateExperienceFormValues>
    ).reduce((acc, key) => {
      const currentValue = data[key];
      const defaultValue = defaultValues[key];

      if (!isEqual(currentValue, defaultValue)) {
        (acc as any)[key] = currentValue;
      }

      return acc;
    }, {} as Partial<TUpdateExperienceFormValues>);

    if (Object.keys(dataToUpdate).length === 0) {
      return toast.info("No changes detected.");
    }

    startTransition(async () => {
      toast.promise(updateSelectedExperience(experience.id, dataToUpdate), {
        loading: "Updating experience...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.replace("/dashboard/experiences"),
            message: "Experience updated successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while updating experience",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <PageContainer
      pageTitle="Experience Details"
      pageDescription="Edit specific information about the project"
      scrollable
    >
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmitUpdateExperience)}
            className="flex flex-col gap-4"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                  <h3>{heading || `Unknown Role`}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormInput
                  className="w-full"
                  control={form.control}
                  type="text"
                  name="role"
                  label="Role"
                  disabled={loading}
                  required
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setHeading(newVal);
                  }}
                />
                <FormInput
                  className="w-full"
                  control={form.control}
                  type="text"
                  name="organization"
                  label="Organization"
                  disabled={loading}
                  required
                />
                <ResponsibilityInputList
                  control={form.control}
                  errors={errors}
                />
                <div className="grid-cols grid items-start gap-4 md:grid-cols-[2fr_1fr_1fr]">
                  <FormInput
                    control={form.control}
                    type="text"
                    name="location"
                    label="Location"
                    className="w-full"
                    disabled={loading}
                    required
                  />
                  <FormSelect
                    control={form.control}
                    name="work_type"
                    label="Work Type"
                    options={workTypeKeys.map((key) => ({
                      label: `${capitalize(key)}`,
                      value: key,
                    }))}
                    className="w-full"
                    disabled={loading}
                    required
                  />
                  <FormSelect
                    control={form.control}
                    name="work_category"
                    label="Work Category"
                    options={workCategoryKeys.map((key) => {
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
                    required
                  />
                </div>
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
                      defaultMonth: defaultValues.end_date ?? undefined,
                      disabledDateRules: (date) =>
                        defaultValues.end_date
                          ? date <= currentStartDate
                          : false,
                      disabledState: isChecked as boolean,
                    }}
                    required
                  />
                  <FormCheck
                    control={form.control}
                    name="is_current"
                    label="I'm currently working here"
                    checkedValue={isChecked as boolean}
                    onChange={(checked) => {
                      setValue("is_current", checked, {
                        shouldValidate: true,
                      });

                      if (checked) {
                        setValue("end_date", null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      } else {
                        setValue(
                          "end_date",
                          experience.end_date
                            ? new Date(experience.end_date)
                            : null,
                        );
                      }
                    }}
                    disabled={loading}
                  />
                </div>
                <FormDropdown
                  control={form.control}
                  label="Related Asset"
                  name="related_asset"
                  item="asset"
                  options={assets}
                  defaultValue={file_name}
                  disabled={loading}
                />
              </CardContent>
            </Card>

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

export default EditExperience;
