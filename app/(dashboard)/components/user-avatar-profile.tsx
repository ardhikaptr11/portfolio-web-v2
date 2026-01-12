import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    email: string;
    name: string;
  }
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage src="" alt="user avatar" />
        <AvatarFallback className="rounded-lg">
          {user?.name?.[0]?.toUpperCase() || "CN"}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold capitalize">
            {user?.name}
          </span>
          <span className="truncate text-xs">{user?.email}</span>
        </div>
      )}
    </div>
  );
}