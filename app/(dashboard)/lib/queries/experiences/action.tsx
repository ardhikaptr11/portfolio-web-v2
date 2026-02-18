"use server";

import { TAddExperiencesFormValues } from "@/app/(dashboard)/components/views/Experiences/add-experiences";
import { TUpdateExperienceFormValues } from "@/app/(dashboard)/components/views/Experiences/edit-experience";
import { IExperience } from "@/app/(dashboard)/types/data";
import { createClient } from "@/lib/supabase/server";
import { formatDistance } from "date-fns";

const TABLE_NAME = "experiences";

const convertDuration = (duration: string) => {
  const [number, unit] = duration.split(" ");

  switch (unit) {
    case "year":
      return Number(number) * 365;
    case "month":
      return Number(number) * 30;
    case "week":
      return Number(number) * 7;
    default:
      return number;
  }
};

const getSelectedExperience = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
        role,
        organization,
        work_category,
        work_type,
        responsibilities,
        location,
        start_date,
        is_current,
        end_date,
        related_asset,
        assets (
          file_name
        )
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const { assets, ...rest } = data;

  const file_name = (assets as Record<string, any>).file_name;

  const experience = {
    ...rest,
    file_name,
  } as IExperience;

  return experience;
};

const getFilteredExperiences = async (filters: {
  page: number;
  pageLimit: number;
  search: string;
  work_type: string;
  duration: string[];
  work_category: string[];
  sort: string;
}) => {
  const supabase = await createClient();

  // Pagination
  const from = (filters.page - 1) * filters.pageLimit;
  const to = from + filters.pageLimit - 1;

  let query = supabase
    .from("experiences")
    .select(
      "id, role, location, organization, work_category, work_type, responsibilities, start_date, end_date, duration",
      { count: "exact" },
    );

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    query = query.or(
      `role.ilike.${searchPattern},organization.ilike.${searchPattern},location.ilike.${searchPattern}`,
    );
  }

  if (filters.work_category.length > 0)
    query = query.in("work_category", filters.work_category);

  if (filters.work_type) query = query.eq("work_type", filters.work_type);

  if (filters.duration.length > 0) {
    const orConditions = filters.duration
      .map((duration) => {
        switch (duration) {
          case "lt-3":
            return "duration_number.lt.90";
          case "3-6":
            return "and(duration_number.gte.90,duration_number.lte.180)";
          case "gt-6":
            return "and(duration_number.gt.180,duration_number.lte.1080)";
          case "gt-36":
            return "duration_number.gt.1080";
          default:
            return "";
        }
      })
      .filter(Boolean);

    query = query.or(orConditions.join(","));
  }

  if (filters.sort) {
    const [column, order] = filters.sort.split(".");

    const targetColumn = column === "duration" ? "duration_number" : column;

    query = query.order(targetColumn, { ascending: order === "asc" });
  } else {
    query = query.order("start_date", { ascending: false });
  }

  query = query.range(from, to);

  const { data, count, error } = await query;

  const experiences = data as IExperience[];

  if (error) throw error;

  return {
    experiences,
    total: count || 0,
  };
};

const bulkAddExperiences = async (
  payload: TAddExperiencesFormValues["experiences"],
) => {
  const supabase = await createClient();

  const modifiedPayload = payload.map((experience) => {
    const duration = experience.end_date
      ? formatDistance(experience.end_date, experience.start_date as Date)
      : null;

    const duration_number = duration ? convertDuration(duration) : 0;

    return {
      ...experience,
      start_date: experience.start_date?.toISOString(),
      end_date: experience.end_date?.toISOString(),
      duration,
      duration_number,
    };
  });

  const { error } = await supabase.from(TABLE_NAME).insert(modifiedPayload);

  if (error) throw error;
};

const updateSelectedExperience = async (
  id: string,
  payload: Partial<TUpdateExperienceFormValues>,
) => {
  const supabase = await createClient();

  const updated_at = Date.now().toLocaleString();
  const modifiedPayload = { ...payload, updated_at };

  const { error } = await supabase
    .from(TABLE_NAME)
    .update(modifiedPayload)
    .eq("id", id);

  if (error) throw error;
};

export {
  getSelectedExperience,
  getFilteredExperiences,
  bulkAddExperiences,
  updateSelectedExperience,
};
