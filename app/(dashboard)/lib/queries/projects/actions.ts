"use server";

import { TAddProjectsFormValues } from "@/app/(dashboard)/components/views/Projects/add-projects";
import { TUpdateProjectFormValues } from "@/app/(dashboard)/components/views/Projects/edit-project";
import { BUCKET_NAME } from "@/app/(dashboard)/constants/items.constants";
import { IProject } from "@/app/(dashboard)/types/data";
import { capitalize } from "@/lib/helpers";
import { createClient } from "@/lib/supabase/server";
import { ISortOrder } from "../../search-params";

const TABLE_NAME = "projects";

const getSelectedProject = async (slug: IProject["slug"]) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from(TABLE_NAME).select("asset_id, title, slug, description, overview, tech_stack, urls").eq("slug", slug).single();

  if (error) throw error;

  const { data: asset } = await supabase.from(BUCKET_NAME).select("file_name").eq("id", data.asset_id).single();

  const project = { ...data, file_name: asset?.file_name } as IProject;

  return project;
};

const getFilteredProjects = async ({
  page = 1,
  pageLimit = 10,
  category,
  search,
  sort
}: {
  page?: number;
  pageLimit?: number;
  category?: string;
  search?: string;
  sort?: ISortOrder[];
}) => {
  const supabase = await createClient();

  // Pagination
  const from = (page - 1) * pageLimit;
  const to = from + pageLimit - 1;

  let query = supabase.from(TABLE_NAME).select(`
    asset_id, 
    title, 
    slug,
    description, 
    tech_stack, 
    urls,
    assets (
      url
    ),
    created_at,
    updated_at
  `, { count: "exact" });

  if (search) {
    const searchText = search.trim();
    const upperSearchText = searchText.toUpperCase();
    const capitalizedSearchText = capitalize(searchText);

    query = query.or(`title.ilike.%${searchText}%,tech_stack.cs.{"${searchText}"},tech_stack.cs.{"${upperSearchText}"},tech_stack.cs.{"${capitalizedSearchText}"}`);
  }

  if (category) {
    const categories = category.split(",");
    query = query.in("category", categories);
  }

  query = query.range(from, to);

  // Sorting
  if (sort && sort.length > 0) {
    sort.forEach((s) => {
      const sortField = s.id === "search" ? "title" : s.id;
      query = query.order(sortField, { ascending: !s.desc });
    });
  } else {
    // default sort
    query = query.order("title", { ascending: true });
  }

  const { data, count, error } = await query;

  if (error) throw error;

  const projects = data.map((project) => {
    const asset_url = (project.assets as Record<string, any>).url || "";

    return {
      title: project.title,
      asset_url,
      slug: project.slug,
      description: project.description,
      tech_stack: project.tech_stack,
      urls: project.urls,
      created_at: project.created_at,
      updated_at: project.updated_at
    };
  }) as unknown as IProject[];


  return {
    success: true,
    total: count || 0,
    projects,
    page,
    pageLimit,
    offset: from
  };
};

const bulkAddProjects = async (payload: TAddProjectsFormValues["projects"]) => {
  const supabase = await createClient();

  const modifiedPayload = payload.map((project) => {
    return {
      title: project.title,
      slug: project.slug,
      asset_id: project.thumbnail,
      description: project.description,
      overview: project.overview,
      tech_stack: project.tech_stack,
      urls: project.urls,
    };
  });

  const { error: insertError } = await supabase.from(TABLE_NAME).insert(modifiedPayload);

  if (insertError) throw insertError;
};

const updateSelectedProject = async (slug: IProject["slug"], payload: Partial<TUpdateProjectFormValues>) => {
  const supabase = await createClient();

  const updated_at = Date.now().toLocaleString();
  const modifiedPayload = { ...payload, updated_at };

  const { error } = await supabase.from(TABLE_NAME).update(modifiedPayload).eq("slug", slug);

  if (error) throw error;
};

const deleteSelectedProject = async (slug: IProject["slug"]) => {
  const supabase = await createClient();

  const { error } = await supabase.from(TABLE_NAME).delete().eq("slug", slug);

  if (error) throw error;
};

const deleteSelectedProjects = async (ids: IProject["id"][]) => {
  const supabase = await createClient();

  const { error } = await supabase.from(TABLE_NAME).delete().in("id", ids);

  if (error) throw error;
};

export { bulkAddProjects, deleteSelectedProject, deleteSelectedProjects, getFilteredProjects, getSelectedProject, updateSelectedProject };

