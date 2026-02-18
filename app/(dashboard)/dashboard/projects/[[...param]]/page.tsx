import AddProjects from "@/app/(dashboard)/components/views/Projects/add-projects";
import EditProject from "@/app/(dashboard)/components/views/Projects/edit-project";
import ManageProjects from "@/app/(dashboard)/components/views/Projects/manage-projects";
import { getSelectedProject } from "@/app/(dashboard)/lib/queries/projects/actions";
import { searchParamsCache } from "@/app/(dashboard)/lib/search-params";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";

type ProjectsPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ param: string }>;
};

export const generateMetadata = async ({
  searchParams,
  params,
}: ProjectsPageProps) => {
  const { slug } = await searchParams;
  const { param } = await params;

  const pathname = param?.[0];

  if (pathname === "new") return { title: "New Projects | Dashboard" };

  if (!pathname && !slug) return { title: "Manage Projects | Dashboard" };

  const project = await getSelectedProject(`${slug}`);

  return { title: `${project?.title} | Dashboard` };
};

const ProjectsPage = async ({ searchParams, params }: ProjectsPageProps) => {
  const { slug, ...resolvedSearchParams } = await searchParams;
  const { param } = await params;

  const pathname = param?.[0];

  searchParamsCache.parse(resolvedSearchParams);

  // e.g /dashboard/projects/new -> matched
  if (pathname && pathname === "new") return <AddProjects />;

  // e.g /dashboard/projects/delete -> matched
  // e.g /dashboard/projects/edit?description=1 -> matched
  // e.g /dashboard/projects/edit?id=1 -> matched
  if (pathname && !["edit", "new"].includes(pathname)) notFound();

  // e.g /dashboard/projects -> matched
  if (!pathname) return <ManageProjects />;

  // e.g /dashboard/projects/edit?slug=test -> matched
  const project = await getSelectedProject(`${slug}`);

  return <EditProject project={project} />;
};

export default ProjectsPage;
