import UploadAssets from "@/app/(dashboard)/components/views/Assets/upload-assets";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { Heading } from "../../components/heading";
import PageContainer from "../../components/layout/page-container";
import { AssetsListing } from "../../components/lists/assets-listing";
import { DataTableSkeleton } from "../../components/table/data-table-skeleton";
import { searchParamsCache, serialize } from "../../lib/search-params";
import ManageAssets from "../../components/views/Assets/manage-assets";

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
