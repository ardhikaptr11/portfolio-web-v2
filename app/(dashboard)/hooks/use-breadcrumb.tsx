"use client";

import { slugToTitle } from "@/lib/helpers";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = { title: string; link: string };

const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/dashboard": [{ title: "Dashboard", link: "/dashboard" }],
  "/dashboard/profile": [
    { title: "Dashboard", link: "#" },
    { title: "Profile", link: "/dashboard/profile" },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const breadcrumbs = useMemo(() => {
    // /dashboard/assets
    // /dashboard/assets?action=upload
    const segments = pathname.split("/").filter(Boolean); // ["dashboard", "assets"]

    if (routeMapping[pathname]) return routeMapping[pathname];

    // if (
    //   segments[0] === "dashboard" &&
    //   segments[1] === "articles" &&
    //   segments.length === 3
    // ) {
    //   const slug = segments[2];
    //   const formattedTitle = slug
    //     .split("-")
    //     .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    //     .join(" ");
    //   return [
    //     { title: "Dashboard", link: "/dashboard" },
    //     { title: "Artikel", link: "/dashboard/articles" },
    //     { title: formattedTitle, link: pathname },
    //   ];
    // }

    // if (
    //   segments[0] === "dashboard" &&
    //   segments[1] === "products" &&
    //   segments.length === 3
    // ) {
    //   const slug = segments[2];
    //   const formattedTitle = slug
    //     .split("-")
    //     .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    //     .join(" ");
    //   return [
    //     { title: "Dashboard", link: "/dashboard" },
    //     { title: "Produk", link: "/dashboard/products" },
    //     { title: formattedTitle, link: pathname },
    //   ];
    // }

    if (pathname === "/dashboard/assets") {
      return searchParams.get("action") === "upload"
        ? [
            { title: "Dashboard", link: "/dashboard" },
            { title: "Assets", link: "/dashboard/assets" },
            { title: "Upload", link: "#" },
          ]
        : [
            { title: "Dashboard", link: "/dashboard" },
            { title: "Assets", link: "#" },
          ];
    }

    if (pathname === "/dashboard/projects/edit") {
      const slug = `${searchParams.get("slug")}`;
      return searchParams.has("slug")
        ? [
            { title: "Dashboard", link: "/dashboard" },
            { title: "Projects", link: "/dashboard/projects" },
            {
              title: `${slugToTitle(slug)}`,
              link: "#",
            },
          ]
        : [
            { title: "Dashboard", link: "/dashboard" },
            { title: "Projects", link: "#" },
          ];
    }

    return segments.map((segment, index) => {
      const url = `/${segments.slice(0, index + 1).join("/")}`;
      const title = segment
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
      return { title, link: url };
    });
  }, [pathname, searchParams]);

  return breadcrumbs;
}
