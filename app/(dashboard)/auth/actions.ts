"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { headers } from "next/headers";
import {
  AuthFormValue,
  GuestAuthFormValue,
} from "../components/views/Auth/auth-form";
import { environments } from "@/app/environments";

export const getClientIP = async () => {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-vercel-forwarded-for")?.split(",")[0] ||
    headerStore.get("x-forwarded-for")?.split(",")[0] ||
    headerStore.get("x-real-ip") ||
    "127.0.0.1";

  return ip.trim();
};

async function getGeoLocation(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return {
      city: data.city || "Unknown",
      country: data.country_name || "Unknown",
    };
  } catch (error) {
    return { city: "Error", country: "Error" };
  }
}

export const loginAsAdmin = async ({ email, password }: AuthFormValue) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
};

export const loginAsGuest = async ({
  name,
  email,
}: GuestAuthFormValue) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: environments.GUEST_PASSWORD,
  });

  if (error) throw error;

  const ip = await getClientIP();
  const { city, country } = await getGeoLocation(ip);

  await supabase.from("guests").insert({
    name,
    ip_address: ip,
    city: city,
    country: country,
  });
};

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/dashboard", "layout");
};
