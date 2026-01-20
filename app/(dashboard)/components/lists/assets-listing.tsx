import { searchParamsCache } from "../../lib/search-params";
import { AssetsTable } from "../views/Assets/table";
import { getFilteredAssets } from "../../lib/queries/assets";
import { columns } from "../views/Assets/table/column";

type TAssetsListing = {};

export const AssetsListing = async ({}: TAssetsListing) => {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const pageLimit = searchParamsCache.get("perPage");
  const category = searchParamsCache.get("category");
  const sort = searchParamsCache.get("sort");

  const sortArray = sort && JSON.parse(sort);

  const { assets, total } = await getFilteredAssets({
    category: category as string,
    limit: pageLimit as number,
    page: page as number,
    search: search as string,
    sort: sortArray,
  });

  return <AssetsTable data={assets} totalItems={total} columns={columns} />;
};
