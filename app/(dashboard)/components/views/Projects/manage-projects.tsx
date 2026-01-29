import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import PageContainer from "../../layout/page-container";
import { ProjectsListing } from "../../lists/projects-listing";
import { DataTableSkeleton } from "../../table/data-table-skeleton";

const ManageProjects = () => {
  return (
    <PageContainer
      scrollable={false}
      pageTitle="Projects"
      pageDescription="You can manage by editing projects information here"
      pageHeaderAction={
        <Link
          href="/dashboard/projects/new"
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
        <ProjectsListing />
      </Suspense>
    </PageContainer>
  );
};

export default ManageProjects;
