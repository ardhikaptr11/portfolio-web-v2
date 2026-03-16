import ExperienceListing from "@/app/(dashboard)/components/lists/experience-listing";
import AddExperience from "@/app/(dashboard)/components/views/Experience/add-experience";
import EditExperience from "@/app/(dashboard)/components/views/Experience/edit-experience";
import ManageExperience from "@/app/(dashboard)/components/views/Experience/manage-experience";
import { getSelectedExperience } from "@/app/(dashboard)/lib/queries/experience/action";
import { experienceSearchParamsCache } from "@/app/(dashboard)/lib/search-params";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";

type ExperiencePageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ param: string }>;
};

export const generateMetadata = async ({
  searchParams,
  params,
}: ExperiencePageProps): Promise<Metadata> => {
  // read route params
  const { id } = await searchParams;
  const { param } = await params;

  const segment = Array.isArray(param) ? param[0] : param;

  if (segment === "new")
    return constructMetadata({
      title: "New Experience",
      pathname: `/dashboard/experience/${segment}`,
    });

  if (!id)
    return constructMetadata({
      title: "Manage Experience",
      pathname: "/dashboard/experience",
    });

  return constructMetadata({
    title: "Experience Details",
    pathname: `/dashboard/experience/edit?id=${id}`,
  });
};

const ExperiencePage = async ({
  searchParams,
  params,
}: ExperiencePageProps) => {
  const { id, ...resolvedSearchParams } = await searchParams;
  const { param } = await params;

  const searchKey = JSON.stringify(resolvedSearchParams);

  const segment = Array.isArray(param) ? param[0] : param;

  experienceSearchParamsCache.parse(resolvedSearchParams);

  if (segment && segment === "new") return <AddExperience />;

  if (segment && !["edit", "new"].includes(segment)) notFound();

  // e.g /dashboard/projects -> matched
  if (!segment)
    return (
      <ManageExperience searchKey={searchKey}>
        <ExperienceListing />
      </ManageExperience>
    );

  const experience = await getSelectedExperience(`${id}`);

  return <EditExperience experience={experience} />;
};

export default ExperiencePage;
