"use server"

import readUserSession from "@/lib/read-session";
import { createClient } from "@/lib/supabase/server";
import { TUpdateProfile } from "../../components/views/Profile/profile-info";
import { IAccountInfo, IProfile } from "../../types/user";
import { SupabaseClient } from "@supabase/supabase-js";
import { extractPathFromPublicUrl } from "@/lib/utils";

// Get name and email
const getAccountInfo = async () => {
  const supabase = await createClient();

  const authUser = await readUserSession()

  const { data, error } = await supabase
    .from('profile')
    .select('name')
    .eq('id', authUser?.id)
    .single();

  if (error) throw error;

  const profile = {
    ...data,
    email: authUser?.email
  } as IAccountInfo

  return profile;
}

// Get user profile (name & email)
const getProfile = async () => {
  const supabase = await createClient();

  const authUser = await readUserSession()

  const { data, error } = await supabase
    .from('profile')
    .select('avatar_url, name, tagline, biography, roles, skills, social_links, cv_url')
    .eq('id', authUser?.id)
    .single();

  if (error) throw error;

  const profile = {
    ...data,
    email: authUser?.email
  } as IProfile

  return profile;
}

// Upload Avatar
const uploadAvatar = async (client: SupabaseClient, avatarFile: File) => {

  const ext = avatarFile.name.split(".").pop()

  const fileName = `profile-avatar.${ext}`;

  const { error: errorUpload } = await client.storage
    .from("assets")
    .upload(fileName, avatarFile, { upsert: true });

  if (errorUpload) throw new Error("Error while uploading image");

  const {
    data: { publicUrl }
  } = client.storage.from("assets").getPublicUrl(fileName);

  return publicUrl;
}

// Upload Avatar
const uploadCV = async (client: SupabaseClient, cvFile: File) => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  const formattedDate = `${day}${month}${year}`;

  const ext = cvFile.name.split(".").pop()

  const fileName = `cv-ardhika-putra-${formattedDate}.${ext}`;

  const { error: errorUpload } = await client.storage
    .from("assets")
    .upload(fileName, cvFile, { upsert: true });

  if (errorUpload) throw new Error("Error while uploading file");

  const {
    data: { publicUrl }
  } = client.storage.from("assets").getPublicUrl(fileName);

  return publicUrl;
}

const updateProfile = async (payload: TUpdateProfile) => {
  // Check if avatar_url is already exist within the table
  const { avatar_url, cv_url } = await getProfile()

  const filesToDelete: string[] = []

  if (avatar_url && payload.avatar instanceof File) {
    const path = extractPathFromPublicUrl(avatar_url, "assets") as string
    filesToDelete.push(path)
  }

  if (cv_url && payload.cv instanceof File) {
    const path = extractPathFromPublicUrl(cv_url, "assets") as string
    filesToDelete.push(path)
  }

  const supabase = await createClient();
  const authUser = await readUserSession();

  if (filesToDelete.length > 0) {
    const { error: errorDelete } = await supabase
      .storage
      .from("assets")
      .remove(filesToDelete)

    if (errorDelete) return { error: errorDelete?.message }
  }

  const uploadTasks = [
    payload.avatar && payload.avatar instanceof File ? uploadAvatar(supabase, payload.avatar) : Promise.resolve(avatar_url),
    payload.cv && payload.cv instanceof File ? uploadCV(supabase, payload.cv) : Promise.resolve(cv_url)
  ]

  const [publicAvatarUrl, publicCvUrl] = await Promise.all(uploadTasks)

  delete payload.avatar
  delete payload.cv

  const { error: errorUpdate } = await supabase
    .from("profile")
    .update({
      avatar_url: publicAvatarUrl,
      cv_url: publicCvUrl,
      ...payload
    })
    .eq("id", authUser?.id)

  return errorUpdate ? { error: errorUpdate?.message } : { error: null }
}

export {
  getAccountInfo,
  getProfile,
  updateProfile
}