import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers";
import { IAccountInfo } from "../types/user";

interface IUserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: IAccountInfo;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: IUserAvatarProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage src={user.avatar_url} alt="User avatar" />
        <AvatarFallback className="rounded-lg">
          {getInitials(user?.name) || "GU"}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold capitalize">
            {user.name || "Guest"}
          </span>
          <span className="truncate text-xs">{user?.email}</span>
        </div>
      )}
    </div>
  );
}
