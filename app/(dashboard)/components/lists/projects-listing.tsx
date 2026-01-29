import { getFilteredProjects } from "../../lib/queries/projects/actions";
import { searchParamsCache } from "../../lib/search-params";
import { ProjectsTable } from "../views/Projects/table";
import { columns } from "../views/Projects/table/column";

type TProjectsListing = {};

export const ProjectsListing = async ({}: TProjectsListing) => {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page") as number;
  const search = searchParamsCache.get("search") as string;
  const pageLimit = searchParamsCache.get("perPage") as number;
  const sort = JSON.parse(searchParamsCache.get("sort") as string);

  const { projects, total } = await getFilteredProjects({
    pageLimit,
    page,
    search,
    sort,
  });

  return <ProjectsTable data={projects} totalItems={total} columns={columns} />;
};
