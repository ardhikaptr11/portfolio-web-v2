"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "../hooks/use-breadcrumb";
import { cn } from "@/lib/utils";
import { IconSlash } from "@tabler/icons-react";
import { Fragment } from "react";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem
                className={cn({
                  "hidden md:block": isDashboard,
                })}
              >
                <BreadcrumbLink
                  href={item.link}
                  className={cn({ "pointer-events-none": item.link === "#" })}
                >
                  {item.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator
                className={cn({
                  "hidden md:block": isDashboard,
                })}
              >
                <IconSlash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage className="line-clamp-2 md:line-clamp-none">
                {item.title}
              </BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
