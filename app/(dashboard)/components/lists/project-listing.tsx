import { getFilteredProjects } from "../../lib/queries/projects/actions";
import { searchParamsCache } from "../../lib/search-params";
import { ProjectsTable } from "../views/Projects/table";
import { columns } from "../views/Projects/table/column";

type TProjectListing = {};

export const ProjectListing = async ({}: TProjectListing) => {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");

  const { projects, total } = await getFilteredProjects({
    pageLimit,
    page,
    search,
    sort,
  });

  return <ProjectsTable data={projects} totalItems={total} columns={columns} />;
};
