import { Metadata } from "next";
import UnderDevelopment from "@/app/(root)/components/views/under-development";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Coming Soon",
  indexable: false,
});

const ProjectDetailsPage = () => {
  return <UnderDevelopment />;
};

export default ProjectDetailsPage;
