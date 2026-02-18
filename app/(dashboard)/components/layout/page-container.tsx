import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heading } from "../heading";
import type { InfobarContent } from "@/components/ui/infobar";

function PageSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4 p-4 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-96 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-6 h-40 w-full rounded-lg bg-muted" />
      <div className="h-40 w-full rounded-lg bg-muted" />
    </div>
  );
}

export default function PageContainer({
  children,
  scrollable = true,
  isloading = false,
  access = true,
  accessFallback,
  pageTitle,
  pageDescription,
  infoContent,
  pageHeaderAction,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  isloading?: boolean;
  access?: boolean;
  accessFallback?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  infoContent?: InfobarContent;
  pageHeaderAction?: React.ReactNode;
}) {
  if (!access) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 md:px-6">
        {accessFallback ?? (
          <div className="text-center text-lg text-muted-foreground">
            You do not have access to this page.
          </div>
        )}
      </div>
    );
  }

  const content = isloading ? <PageSkeleton /> : children;

  return scrollable ? (
    <ScrollArea className="h-[calc(100dvh-52px)]">
      <div className="flex flex-1 flex-col p-4 md:px-6">
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:items-end md:justify-between md:space-y-0">
          <Heading
            title={pageTitle ?? ""}
            description={pageDescription ?? ""}
            infoContent={infoContent}
          />
          {pageHeaderAction && <div>{pageHeaderAction}</div>}
        </div>
        {content}
      </div>
    </ScrollArea>
  ) : (
    <div className="flex flex-1 flex-col p-4 md:px-6">
      <div className="mb-4 flex flex-col space-y-2 md:flex-row md:items-end md:justify-between md:space-y-0">
        <Heading
          title={pageTitle ?? ""}
          description={pageDescription ?? ""}
          infoContent={infoContent}
        />
        {pageHeaderAction && <div>{pageHeaderAction}</div>}
      </div>
      {content}
    </div>
  );
}
