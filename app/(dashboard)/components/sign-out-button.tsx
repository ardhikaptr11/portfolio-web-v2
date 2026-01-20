"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { logout } from "../auth/actions";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();
        toast.success("You have successfully logged out");

        router.push("/auth");
      } catch (err) {
        toast.error("Logout failed", {
          description: (err as Error).message,
        });
      }
    });
  };

  return (
    <Button
      variant="ghost"
      disabled={loading}
      onClick={handleLogout}
      className="p-0! font-normal"
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
