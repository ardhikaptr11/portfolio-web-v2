import { getFilteredExperiences } from "../../lib/queries/experience/action";
import { experienceSearchParamsCache } from "../../lib/search-params";
import ItemsGrid from "../views/Experience/component/items-grid";
import ResultIndicator from "../views/Experience/component/result-indicator";

type TExperienceListing = {};

const ExperienceListing = async ({}: TExperienceListing) => {
  const page = experienceSearchParamsCache.get("page");
  const pageLimit = experienceSearchParamsCache.get("perPage");
  const search = experienceSearchParamsCache.get("search");
  const duration = experienceSearchParamsCache.get("duration");
  const work_type = experienceSearchParamsCache.get("work_type");
  const work_category = experienceSearchParamsCache.get("work_category");
  const sort = experienceSearchParamsCache.get("sort");

  const { experiences, total } = await getFilteredExperiences({
    page,
    pageLimit,
    search,
    duration,
    work_type,
    work_category,
    sort,
  });

  return (
    <div className="space-y-4">
      <ResultIndicator totalItems={total} />
      <ItemsGrid data={experiences} />
    </div>
  );
};

export default ExperienceListing;
