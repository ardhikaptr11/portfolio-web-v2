"use server";

import readUserSession from "@/lib/read-session";
import { createClient } from "@/lib/supabase/server";
import { TUpdateProfile } from "../../../components/views/Profile/profile-info";
import { IAccountInfo, IProfile } from "../../../types/user";
import { SupabaseClient } from "@supabase/supabase-js";
import { extractPathFromPublicUrl, generateFilenameWithDatetime } from "@/lib/utils";
import { getCurrentDate } from "@/lib/helpers";
import { BUCKET_NAME } from "../../../constants/items.constants";

// Get name and email
const getAccountInfo = async () => {
  const supabase = await createClient();

  const authUser = await readUserSession();

  const { data, error } = await supabase
    .from("profile")
    .select("name, avatar_id")
    .eq("id", authUser?.id)
    .single();

  if (error) throw error;

  const { data: asset } = await supabase.from("assets").select("url").eq("id", data.avatar_id).single();

  const profile = {
    name: data.name,
    avatar_url: asset?.url,
    email: authUser?.email
  } as IAccountInfo;

  return profile;
};

// Get user profile (name & email)
const getProfile = async () => {
  const supabase = await createClient();

  const authUser = await readUserSession();

  const { data, error: errorFetchProfile } = await supabase
    .from("profile")
    .select("name, motto, tagline, avatar_id, cv_id, roles, skills, social_links")
    .eq("id", authUser?.id)
    .single();

  if (errorFetchProfile) throw errorFetchProfile;

  const { data: assetsData, error: errorFetchAssets } = await supabase.from("assets").select("id, url").in("id", [data.avatar_id, data.cv_id]);

  if (errorFetchAssets) throw errorFetchAssets;

  const avatarData = assetsData.find(item => item.id === data.avatar_id);
  const cvData = assetsData.find(item => item.id === data.cv_id);

  const profile = {
    avatar: {
      id: avatarData?.id,
      url: avatarData?.url
    },
    name: data.name,
    email: authUser?.email,
    motto: data.motto,
    tagline: data.tagline,
    roles: data.roles,
    skills: data.skills,
    social_links: data.social_links,
    cv: {
      id: cvData?.id,
      url: cvData?.url
    }
  } as IProfile;

  return profile;
};

// Upload Avatar
const uploadAvatar = async (client: SupabaseClient, avatarFile: File) => {

  const { formattedName: fileName, ext } = generateFilenameWithDatetime(avatarFile.name);
  const filePath = `${fileName}.${ext}`;

  const { error: errorUpload } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, avatarFile);

  if (errorUpload) throw errorUpload;

  const {
    data: { publicUrl }
  } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  const { data: insertedData, error: insertError } = await client.from("assets").insert({
    file_name: fileName,
    ordering: 0,
    category: "image",
    url: publicUrl,
    file_path: filePath // reference for deleting file
  }).select("id, url").single();

  if (insertError) throw insertError;

  return insertedData;
};

// Upload CV
const uploadCV = async (client: SupabaseClient, cvFile: File) => {
  const { ext } = generateFilenameWithDatetime(cvFile.name);

  const fileName = `cv-ardhika-${getCurrentDate()}`;
  const filePath = `${fileName}.${ext}`;

  const { error: errorUpload } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, cvFile);

  if (errorUpload) throw errorUpload;

  const {
    data: { publicUrl }
  } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  const { data } = await client
    .from(BUCKET_NAME)
    .select("ordering")
    .eq("category", "file")
    .not("ordering", "is", null)
    .order("ordering", { ascending: false })
    .limit(1)
    .single();

  const lastIndex = data?.ordering ?? 0;
  const nextIndex = lastIndex + 1;

  const { data: insertedData, error: insertError } = await client.from("assets").insert({
    file_name: fileName,
    ordering: nextIndex,
    category: "file",
    url: publicUrl,
    file_path: filePath // reference for deleting file
  }).select("id, url").single();

  if (insertError) throw insertError;

  return insertedData;
};

const updateProfile = async (payload: Partial<TUpdateProfile>) => {
  // Check if avatar_url is already exist within the table
  const { avatar, cv } = await getProfile();

  const filesToDelete: string[] = [];

  if (avatar.url && payload.avatar instanceof File) {
    const path = extractPathFromPublicUrl(avatar.url, BUCKET_NAME) as string;
    filesToDelete.push(path);
  }

  if (cv.url && payload.cv instanceof File) {
    const path = extractPathFromPublicUrl(cv.url, BUCKET_NAME) as string;
    filesToDelete.push(path);
  }

  const supabase = await createClient();
  const authUser = await readUserSession();

  if (filesToDelete.length > 0) {
    const { error: errorDelete } = await supabase
      .storage
      .from(BUCKET_NAME)
      .remove(filesToDelete);

    if (errorDelete) return { error: errorDelete?.message };
  }

  const insertTasks = [
    payload.avatar && payload.avatar instanceof File ? uploadAvatar(supabase, payload.avatar) : Promise.resolve(avatar),
    payload.cv && payload.cv instanceof File ? uploadCV(supabase, payload.cv) : Promise.resolve(cv)
  ];

  const [insertedAvatar, insertedCV] = await Promise.all(insertTasks);

  delete payload.avatar;
  delete payload.cv;

  const { error: errorUpdate } = await supabase
    .from("profile")
    .update({
      avatar_id: insertedAvatar.id,
      cv_id: insertedCV.id,
      ...payload
    })
    .eq("id", authUser?.id);

  if (errorUpdate) throw errorUpdate;
};

export {
  getAccountInfo,
  getProfile,
  updateProfile
};