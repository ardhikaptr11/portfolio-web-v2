import { createClient } from "@/lib/supabase/server";
import { IProject, IProjectExtended } from "../../types/data";
import { BUCKET_NAME } from "@/app/(dashboard)/constants/items.constants";
import { capitalize, slugToTitle } from "@/lib/helpers";
import { getAssetUrl } from "./home";

const TABLE_NAME = "projects";

export const getAllExistingProjects = async () => {
  const supabase = await createClient();

  // description_id is the description in Indonesian
  const { data, error } = await supabase.from("projects").select(
    `
      id,
      title,
      slug,
      description,
      description_id,
      tech_stack,
      urls,
      thumbnail:asset_id (
        url
      )
    `
  );

  if (error) throw error;

  const projects = data.map(({ thumbnail, ...rest }) => ({
    ...rest,
    thumbnail_url: getAssetUrl(thumbnail),
  })) as IProject[];

  return projects;
};
export const getSelectedProject = async (slug: IProject["slug"]) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      "asset_id, title, slug, description, description_id, overview, overview_id, tech_stack, roles, project_status, start_date, is_current, end_date, urls",
    )
    .eq("slug", slug)
    .single();

  if (error) throw error;

  const { data: asset } = await supabase
    .from(BUCKET_NAME)
    .select("url")
    .eq("id", data.asset_id)
    .single();

  const project = { ...data, thumbnail_url: asset?.url } as IProjectExtended;

  return project;
};
export const getFilteredProjects = async (filters: {
  page: number;
  pageLimit: number;
  search: string;
  status: string;
  role: string;
  tech_stack: string[];
  sort: string;
}) => {
  const supabase = await createClient();

  // Pagination
  const from = (filters.page - 1) * filters.pageLimit;
  const to = from + filters.pageLimit - 1;

  let query = supabase.from(TABLE_NAME).select(
    `
    title, 
    slug, 
    description, 
    description_id,
    tech_stack,
    thumbnail:assets(url)
  `,
    {
      count: "exact",
    },
  );

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    const searchArray = `{"${capitalize(filters.search)}"}`;

    query = query.or(
      `title.ilike.${searchPattern},tech_stack.ov.${searchArray}`,
    );
  }

  if (filters.status) {
    query = query.eq("project_status", filters.status);
  }

  if (filters.role) {
    query = query.contains(
      "roles",
      JSON.stringify([{ text: slugToTitle(filters.role) }]),
    );
  }

  if (filters.tech_stack.length > 0) {
    const formattedString = filters.tech_stack.map((val) => slugToTitle(val));

    query = query.overlaps("tech_stack", formattedString);
  }

  if (filters.sort) {
    const [column, order] = filters.sort.split(".");

    query = query.order(column, { ascending: order === "asc" });
  }

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  const projects = data.map((project) => {
    const thumbnail_url = (project.thumbnail as Record<string, any>).url || "";
    return {
      ...project,
      thumbnail_url,
    };
  }) as unknown as IProject[];

  return {
    projects,
    total: count || 0,
  };
};
