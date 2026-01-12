import { createClient } from "@/lib/supabase/server";

const readUserSession = async () => {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError
  } = await supabase.auth.getUser();

  if (!authUser) return null;
  if (authError) throw authError;

  return authUser
}

export default readUserSession;