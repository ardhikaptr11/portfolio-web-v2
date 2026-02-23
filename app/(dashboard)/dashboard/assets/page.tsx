import UploadAssets from "@/app/(dashboard)/components/views/Assets/upload-assets";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import ManageAssets from "../../components/views/Assets/manage-assets";
import { searchParamsCache } from "../../lib/search-params";

type AssetsPageProps = {
  searchParams: Promise<SearchParams>;
};

export const generateMetadata = async ({
  searchParams,
}: AssetsPageProps): Promise<Metadata> => {
  // read route params
  const { action } = await searchParams;

  if (!action) return { title: "Manage Assets | Dashboard" };

  return { title: "Upload Assets | Dashboard" };
};

const AssetsPage = async ({ searchParams }: AssetsPageProps) => {
  const { action, ...params } = await searchParams;

  searchParamsCache.parse(params);

  if (!action) return <ManageAssets />;

  if (action !== "upload") notFound();

  return <UploadAssets />;
};

export default AssetsPage;
