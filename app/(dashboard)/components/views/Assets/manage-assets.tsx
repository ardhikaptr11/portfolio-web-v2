import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import PageContainer from "../../layout/page-container";
import { AssetsListing } from "../../lists/assets-listing";
import { DataTableSkeleton } from "../../table/data-table-skeleton";

const ManageAssets = () => {
  return (
    <PageContainer
      scrollable={false}
      pageTitle="Assets"
      pageDescription="You can manage by editing assets information here"
      pageHeaderAction={
        <Link
          href="/dashboard/assets?action=upload"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-xs md:text-sm",
          )}
        >
          <Icons.add className="size-4" /> New
        </Link>
      }
    >
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
        }
      >
        <AssetsListing />
      </Suspense>
    </PageContainer>
  );
};

export default ManageAssets;
