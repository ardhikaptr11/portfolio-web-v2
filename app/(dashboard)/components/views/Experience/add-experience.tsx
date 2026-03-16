"use client";

import { useSessionClient } from "@/app/(dashboard)/hooks/use-session-client";
import { bulkAddExperience } from "@/app/(dashboard)/lib/queries/experience/action";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { capitalize } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears } from "date-fns";
import { useRouter } from "next/navigation";
import { Suspense, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import FormCardSkeleton from "../../form-card-skeleton";
import { FormCheck } from "../../forms/form-check";
import { FormDate } from "../../forms/form-date";
import { FormInput } from "../../forms/form-input";
import { FormSelect } from "../../forms/form-select";
import ResponsibilityInputList from "../../input-list";
import PageContainer from "../../layout/page-container";

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

const ExperienceSchema = z
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
    start_date: z
      .date()
      .nullable()
      .refine((val) => val !== null, "Start date is required"),
    is_current: z.union([z.boolean(), z.string()]).nullable(),
    end_date: z.date().nullable(),
  })
  .refine((data) => (data.is_current ? true : !!data.end_date), {
    message: "End date is required",
    path: ["end_date"],
  });

const AddExperienceFormSchema = z.object({
  experiences: z.array(ExperienceSchema),
});

export type TAddExperienceFormValues = z.input<typeof AddExperienceFormSchema>;

const AddExperiences = () => {
  const { isAuthorized } = useSessionClient();

  const router = useRouter();

  const [loading, startTransition] = useTransition();

  const defaultValues = {
    experiences: [
      {
        role: "",
        organization: "",
        work_type: "",
        work_category: "",
        responsibilities: [" "],
        location: "",
        start_date: null,
        is_current: false,
        end_date: null,
      },
    ],
  };

  const form = useForm<TAddExperienceFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(AddExperienceFormSchema),
    defaultValues,
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const watchedExperiences = watch("experiences");

  const onSubmit = (data: TAddExperienceFormValues) => {
    startTransition(async () => {
      toast.promise(bulkAddExperience(data.experiences), {
        loading: "Adding experience...",
        success: () => {
          const count = data.experiences.length;
          const message =
            count > 1
              ? "All experiences added successfully"
              : "Experience added successfully";

          return {
            duration: 1500,
            onAutoClose: () => router.replace("/dashboard/experience"),
            message,
          };
        },
        error: (error: Error) => {
          return {
            message: "Error saving experience",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <PageContainer
      pageTitle="Add New Experience"
      pageDescription="You can add up to 5 new experiences"
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
              const currentRole = watchedExperiences?.[index]?.role;

              const currentSelectedStartDate = watchedExperiences?.[index]
                ?.start_date as Date;

              const isStillEmployed = watchedExperiences?.[index]
                ?.is_current as boolean;

              return (
                <Card key={field.id} className="w-full">
                  <CardHeader>
                    <CardTitle className="text-left text-2xl font-bold">
                      <div className="flex items-center justify-between">
                        <h3>{currentRole || `Unknown Role ${index + 1}`}</h3>
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
                    <FormInput
                      className="w-full"
                      control={form.control}
                      type="text"
                      name={`experiences.${index}.role`}
                      label="Role"
                      disabled={loading}
                      required
                      onChange={(e) =>
                        setValue(`experiences.${index}.role`, e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                    <FormInput
                      className="w-full"
                      control={form.control}
                      type="text"
                      name={`experiences.${index}.organization`}
                      label="Organization"
                      disabled={loading}
                      required
                    />
                    <ResponsibilityInputList
                      control={form.control}
                      nestIndex={index}
                      errors={errors}
                    />
                    <div className="grid-cols grid items-start gap-4 md:grid-cols-[2fr_1fr_1fr]">
                      <FormInput
                        control={form.control}
                        type="text"
                        name={`experiences.${index}.location`}
                        label="Location"
                        className="w-full"
                        disabled={loading}
                        required
                      />
                      <FormSelect
                        control={form.control}
                        name={`experiences.${index}.work_type`}
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
                        name={`experiences.${index}.work_category`}
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
                        name={`experiences.${index}.start_date`}
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
                        name={`experiences.${index}.end_date`}
                        label="End Date"
                        className="w-full"
                        disabled={loading}
                        config={{
                          ...(isStillEmployed && { placeholder: "Present" }),
                          startMonth: currentSelectedStartDate,
                          endMonth: addYears(currentSelectedStartDate, 10),
                          defaultMonth: currentSelectedStartDate,
                          disabledDateRules: (date) =>
                            date <= currentSelectedStartDate,
                          disabledState: isStillEmployed,
                        }}
                        required
                      />
                      <FormCheck
                        control={form.control}
                        name={`experiences.${index}.is_current`}
                        label="I'm currently working here"
                        onChange={(checked) => {
                          if (checked) {
                            setValue(`experiences.${index}.end_date`, null, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        disabled={loading}
                      />
                    </div>
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
                if (fields.length < 5) append(defaultValues.experiences[0]);
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

export default AddExperiences;
