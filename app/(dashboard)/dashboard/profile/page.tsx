import { constructMetadata } from "@/lib/metadata";
import ProfileInfo from "../../components/views/Profile/profile-info";
import { getProfile } from "../../lib/queries/user/actions";

export const metadata = constructMetadata({
  title: "Profile",
  pathname: "/dashboard/profile",
});

export default async function Page() {
  const profile = await getProfile();

  return <ProfileInfo profile={profile} />;
}
