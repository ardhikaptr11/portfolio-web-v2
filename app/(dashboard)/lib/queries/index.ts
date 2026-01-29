import { createClient } from "@/lib/supabase/client";

const getAllAvailableTechStack = async () => {
  const supabase = createClient();

  const { data: techStack, error } = await supabase
    .from("tech-stack")
    .select("label")
    .order("label", { ascending: true });

  if (error) throw error;

  return techStack;
}

const addNewTechStack = async (label: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tech-stack")
    .insert({ label })
    .select("label")
    .single()

  if (error) throw error;

  return data
} 

export {
  getAllAvailableTechStack,
  addNewTechStack
}