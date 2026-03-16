import UploadAssets from "@/app/(dashboard)/components/views/Assets/upload-assets";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import ManageAssets from "../../components/views/Assets/manage-assets";
import { searchParamsCache } from "../../lib/search-params";
import { constructMetadata } from "@/lib/metadata";

type AssetsPageProps = {
  searchParams: Promise<SearchParams>;
};

export const generateMetadata = async ({
  searchParams,
}: AssetsPageProps): Promise<Metadata> => {
  // read route params
  const { action } = await searchParams;

  const pathname = "/dashboard/assets";

  if (!action) return constructMetadata({ title: "Manage Assets", pathname });

  return constructMetadata({ title: "Upload Assets", pathname });
};

const AssetsPage = async ({ searchParams }: AssetsPageProps) => {
  const { action, ...params } = await searchParams;

  searchParamsCache.parse(params);

  if (!action) return <ManageAssets />;

  if (action !== "upload") notFound();

  return <UploadAssets />;
};

export default AssetsPage;
