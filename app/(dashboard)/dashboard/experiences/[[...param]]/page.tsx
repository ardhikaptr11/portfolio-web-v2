import ExperienceListing from "@/app/(dashboard)/components/lists/experience-listing";
import AddExperiences from "@/app/(dashboard)/components/views/Experiences/add-experiences";
import EditExperience from "@/app/(dashboard)/components/views/Experiences/edit-experience";
import ManageExperiences from "@/app/(dashboard)/components/views/Experiences/manage-experiences";
import { getSelectedExperience } from "@/app/(dashboard)/lib/queries/experiences/action";
import {
  experienceSearchParamsCache,
  serialize,
} from "@/app/(dashboard)/lib/search-params";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";

type ExperiencesPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ param: string }>;
};

// /dashboard/experiences
// /dashboard/experiences/new
// /dashboard/experiences/edit?id=1

export const generateMetadata = async ({
  searchParams,
  params,
}: ExperiencesPageProps): Promise<Metadata> => {
  // read route params
  const { id } = await searchParams;
  const { param } = await params;

  const pathname = param?.[0];

  if (pathname === "new") return { title: "New Experiences | Dashboard" };

  if (!id) return { title: "Manage Experiences | Dashboard" };

  return { title: "Experience Details | Dashboard" };
};

const ExperiencesPage = async ({
  searchParams,
  params,
}: ExperiencesPageProps) => {
  const { id, ...resolvedSearchParams } = await searchParams;
  const { param } = await params;

  const searchKey = JSON.stringify(resolvedSearchParams);

  const pathname = param?.[0];

  experienceSearchParamsCache.parse(resolvedSearchParams);

  if (pathname && pathname === "new") return <AddExperiences />;

  if (pathname && !["edit", "new"].includes(pathname)) notFound();

  // e.g /dashboard/projects -> matched
  if (!pathname)
    return (
      <ManageExperiences searchKey={searchKey}>
        <ExperienceListing />
      </ManageExperiences>
    );

  const experience = await getSelectedExperience(`${id}`);

  return <EditExperience experience={experience} />;
};

export default ExperiencesPage;
