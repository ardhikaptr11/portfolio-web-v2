"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const readUserSession = async () => {
  const supabase = createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) return null;

  return authUser;
};

export const useSessionClient = () => {
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      const user = await readUserSession();

      if (user) setRole(user.app_metadata?.role);
    };

    fetchSession();
  }, []);

  return { isAuthorized: role === "owner" };
}
