import { projectSearchParamsCache } from "@/app/(root)/lib/search-params";
import { getFilteredProjects } from "@/app/(root)/lib/queries/projects";
import ResultIndicator from "./result-indicator";
import ProjectsGrid from "./projects-grid";
import { getProjectListSchemaGraph } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

type TProjectListing = {};

const ProjectListing = async ({}: TProjectListing) => {
  const page = projectSearchParamsCache.get("page");
  const pageLimit = projectSearchParamsCache.get("perPage");
  const search = projectSearchParamsCache.get("search");
  const role = projectSearchParamsCache.get("role");
  const status = projectSearchParamsCache.get("status");
  const tech_stack = projectSearchParamsCache.get("tech_stack");
  const sort = projectSearchParamsCache.get("sort");

  const { projects, total } = await getFilteredProjects({
    page,
    pageLimit,
    search,
    role,
    status,
    tech_stack,
    sort,
  });

  const projectListSchema = await getProjectListSchemaGraph(projects);

  return (
    <div className="space-y-6">
      <JsonLd schema={projectListSchema} />
      <ResultIndicator totalItems={total} />
      <ProjectsGrid data={projects} />
    </div>
  );
};

export default ProjectListing;
