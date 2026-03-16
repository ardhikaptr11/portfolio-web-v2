  import { constructMetadata } from "@/lib/metadata";
  import { getTranslations } from "next-intl/server";
  import { SearchParams } from "nuqs/server";
  import ListingLayout from "../../components/views/Projects/listing-layout";
  import ProjectListing from "../../components/views/Projects/project-listing";
  import { projectSearchParamsCache } from "../../lib/search-params";

  export const generateMetadata = async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) => {
    const { locale } = await params;

    const t = await getTranslations("Schema.projects");

    return constructMetadata({
      locale,
      title: t("title"),
      description: t("description"),
      pathname: "/projects",
    });
  };

  type ProjectListProps = {
    searchParams: Promise<SearchParams>;
  };

  const ProjectListPage = async ({ searchParams }: ProjectListProps) => {
    const resolvedSearchParams = await searchParams;
    const searchKey = JSON.stringify(resolvedSearchParams);

    projectSearchParamsCache.parse(resolvedSearchParams);

    return (
      <ListingLayout searchKey={searchKey}>
        <ProjectListing />
      </ListingLayout>
    );
  };

  export default ProjectListPage;
