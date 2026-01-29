import AddProjects from "@/app/(dashboard)/components/views/Projects/add-projects";
import EditProject from "@/app/(dashboard)/components/views/Projects/edit-project";
import ManageProjects from "@/app/(dashboard)/components/views/Projects/manage-projects";
import { getSelectedProject } from "@/app/(dashboard)/lib/queries/projects/actions";
import { searchParamsCache } from "@/app/(dashboard)/lib/search-params";
import { notFound } from "next/navigation";

type ProjectsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ param: string }>;
};

export const generateMetadata = async ({
  searchParams,
  params,
}: ProjectsPageProps) => {
  const { slug } = await searchParams;
  const { param } = await params;

  const action = param?.[0];

  if (action === "new") return { title: "New Projects | Dashboard" };

  if (!slug) return { title: "Manage Projects | Dashboard" };

  const project = await getSelectedProject(`${slug}`);

  return {
    title: `${project?.title} | Dashboard`,
    description: `Manage specific information about ${project?.title}`,
  };
};

const ProjectsPage = async ({ searchParams, params }: ProjectsPageProps) => {
  const resolvedSearchParams = await searchParams;
  const { param } = await params;

  // const { action, ...params } = await searchParams;

  searchParamsCache.parse(resolvedSearchParams);

  const action = param?.[0];
  const queryParams = Object.keys(resolvedSearchParams)[0];

  // e.g dashboard/projects/new -> matched
  if (action && action === "new") return <AddProjects />;

  // e.g dashboard/projects/delete -> matched
  // e.g dashboard/projects/edit?description=1 -> matched
  // e.g dashboard/projects/edit?id=1 -> matched
  if (
    action &&
    !["edit", "new"].includes(action)
  )
    notFound();

  // e.g dashboard/projects -> matched
  if (!action) return <ManageProjects />;

  const { slug } = resolvedSearchParams;

  // e.g dashboard/projects/edit?id=1&slug=test -> matched
  const project = await getSelectedProject(`${slug}`);

  return <EditProject project={project} />;
};

export default ProjectsPage;
