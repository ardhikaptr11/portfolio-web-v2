import { getFilteredAssets } from "../../lib/queries/assets/actions";
import { searchParamsCache } from "../../lib/search-params";
import { columns } from "../views/Assets/table/column";
import { AssetsTable } from "../views/Assets/table";

type TAssetsListing = {};

export const AssetsListing = async ({}: TAssetsListing) => {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page") as number;
  const search = searchParamsCache.get("search") as string;
  const pageLimit = searchParamsCache.get("perPage") as number;
  const category = searchParamsCache.get("category") as string;
  const sort = JSON.parse(searchParamsCache.get("sort") as string);

  const { assets, total } = await getFilteredAssets({
    category,
    pageLimit,
    page,
    search,
    sort,
  });

  return <AssetsTable data={assets} totalItems={total} columns={columns} />;
};
