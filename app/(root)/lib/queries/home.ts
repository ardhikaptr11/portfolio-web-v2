import { createAdminClient, createClient } from "@/lib/supabase/server";
import { ICertificate, IExperience, IProfile, IProject } from "../../types/data";
import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

const getAssetUrl = (asset: any) => (asset as Record<string, any>)?.url || null;

const getProfile = async (client: SupabaseClient) => {
  const supabase = client ?? await createClient();
  const supabaseAdmin = await createAdminClient();

  const [authResponse, profileResponse] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers(),
    supabase.from("profile")
      .select(`
        name,
        motto,
        tagline,
        roles,
        skills,
        social_links,
        asset:cv_id (url)
      `)
      .single()
  ]);

  if (profileResponse.error) throw profileResponse.error;

  const user = authResponse.data?.users?.[0];
  const { asset, ...rest } = profileResponse.data;

  return {
    ...rest,
    email: user?.email,
    phone: user?.phone,
    cv_asset: (asset as Record<string, any>)?.url
  } as IProfile;
};

const getExperiences = async (client: SupabaseClient) => {
  const supabase = client ?? await createClient();

  const { data, error } = await supabase.from("experiences").select(
    `
        role,
        organization,
        work_category,
        work_type,
        responsibilities,
        responsibilities_id,
        location,
        start_date,
        end_date,
        duration,
        related_asset (
          url
        )
      `
  ).order("ordering", { ascending: true });

  if (error) throw error;

  const experiences = data.map(({ related_asset, ...rest }) => ({
    ...rest,
    related_asset_url: getAssetUrl(related_asset)
  })) as IExperience[];

  return experiences;
};

export const getProjects = async (client?: SupabaseClient) => {
  const supabase = client ?? await createClient();

  const { data, error } = await supabase.from("projects").select(
    `
      id,
      title,
      slug,
      description,
      description_id,
      overview,
      tech_stack,
      urls,
      thumbnail:asset_id (
        url
      )
  `);

  if (error) throw error;

  const projects = data.map(({ thumbnail, ...rest }) => ({
    ...rest,
    thumbnail_url: getAssetUrl(thumbnail)
  })) as IProject[];

  return projects;
};

const getAssets = async (client: SupabaseClient, total: number) => {

  const { data, error } = await client
    .from("assets")
    .select("file_name, url")
    .eq("usage", "Certificate")
    .order("ordering", { ascending: true })
    .limit(total);

  if (error) throw error;

  const certificates = data.map(({ file_name, ...rest }) => ({
    ...rest,
    name: file_name
  })) as ICertificate[];

  return certificates;
};

const getAllData = cache(async () => {
  const supabase = await createClient();

  try {
    const [profile, experiences, projects, certificates] = await Promise.all([
      getProfile(supabase),
      getExperiences(supabase),
      getProjects(supabase),
      getAssets(supabase, 4)
    ]);

    return { profile, projects, experiences, certificates };
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
});

export { getAllData };
