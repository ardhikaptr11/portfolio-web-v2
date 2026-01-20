"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/dashboard", "layout");
}