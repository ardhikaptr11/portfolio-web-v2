"use client";

import { capitalize, slugToTitle } from "@/lib/helpers";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = { title: string; link: string };

const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/dashboard": [{ title: "Dashboard", link: "/dashboard" }],
  "/dashboard/profile": [
    { title: "Dashboard", link: "#" },
    { title: "Profile", link: "/dashboard/profile" },
  ],
  "/projects": [
    { title: "Home", link: "/" },
    { title: "Projects", link: "/projects" },
  ],
  "/id/projects": [
    { title: "Beranda", link: "/" },
    { title: "Proyek", link: "/projects" },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (routeMapping[pathname]) return routeMapping[pathname];

    if (pathname.includes("/id/projects") && segments.length === 3) {
      return [
        { title: "Beranda", link: "/id" },
        { title: "Proyek", link: "/id/projects" },
        { title: `${slugToTitle(segments[segments.length - 1])}`, link: "#" },
      ];
    }

    if (pathname.startsWith("/projects") && segments.length === 2) {
      return [
        { title: "Home", link: "/" },
        { title: "Projects", link: "/projects" },
        { title: `${slugToTitle(segments[segments.length - 1])}`, link: "#" },
      ];
    }

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
        .map((s) => capitalize(s))
        .join(" ");
      return { title, link: url };
    });
  }, [pathname, searchParams]);

  return breadcrumbs;
}
