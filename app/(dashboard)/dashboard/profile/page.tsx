import ProfileInfo from "../../components/views/Profile/profile-info";
import { getProfile } from "../../lib/queries/user/actions";

export const metadata = {
  title: "Profile | Dashboard",
};

export default async function Page() {
  const profile = await getProfile();

  return <ProfileInfo profile={profile} />;
}
