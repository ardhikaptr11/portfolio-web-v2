import { Fragment, Suspense } from "react";
import { getFilteredExperiences } from "../../lib/queries/experiences/action";
import { experienceSearchParamsCache } from "../../lib/search-params";
import FilterAside from "../views/Experiences/component/filter-aside";
import ItemsGrid from "../views/Experiences/component/items-grid";
import { Spinner } from "@/components/ui/spinner";
import ResultIndicator from "../views/Experiences/component/result-indicator";

type TExperiencesListing = {};

const ExperienceListing = async ({}: TExperiencesListing) => {
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
    sort
  });

  return (
    <div className="space-y-4">
      <ResultIndicator totalItems={total} />
      <ItemsGrid data={experiences} />
    </div>
  );
};

export default ExperienceListing;
