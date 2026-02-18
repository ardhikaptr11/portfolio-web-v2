import { getFilteredAssets } from "../../lib/queries/assets/actions";
import { searchParamsCache } from "../../lib/search-params";
import { columns } from "../views/Assets/table/column";
import { AssetsTable } from "../views/Assets/table";

type TAssetsListing = {};

export const AssetsListing = async ({}: TAssetsListing) => {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const pageLimit = searchParamsCache.get("perPage");
  const category = searchParamsCache.get("category");
  const sort = searchParamsCache.get("sort");

  const { assets, total } = await getFilteredAssets({
    category,
    pageLimit,
    page,
    search,
    sort,
  });

  return <AssetsTable data={assets} totalItems={total} columns={columns} />;
};
