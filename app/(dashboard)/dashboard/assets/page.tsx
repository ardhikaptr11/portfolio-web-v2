import UploadAssets from "@/app/(dashboard)/components/views/Assets/upload-assets";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const generateMetadata = async ({
  searchParams,
}: PageProps): Promise<Metadata> => {
  // read route params
  const { action } = await searchParams;

  if (!action) return { title: "Manage Assets | Dashboard" };

  return { title: "Upload Assets | Dashboard" };
};

const AssetsPage = async ({ searchParams }: PageProps) => {
  const { action, ...params } = await searchParams;

  searchParamsCache.parse(params);
  const key = serialize({ ...params });

  if (!action)
    return (
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Heading
              title="Assets"
              description="You can manage by editing assets information here"
            />
            <Link
              href="/dashboard/assets?action=upload"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-xs md:text-sm",
              )}
            >
              <Icons.add className="size-4" /> New
            </Link>
          </div>
          <Suspense
            key={key}
            fallback={
              <DataTableSkeleton
                columnCount={5}
                rowCount={10}
                filterCount={2}
              />
            }
          >
            <AssetsListing />
          </Suspense>
        </div>
      </PageContainer>
    );

  if (action !== "upload") notFound();

  return <UploadAssets />;
};

export default AssetsPage;
