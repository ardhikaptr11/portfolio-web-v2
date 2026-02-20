import { Metadata } from "next";
import UnderDevelopment from "@/app/(root)/components/views/under-development";

export const metadata: Metadata = {
  title: "Coming Soon",
};

const ProjectDetailsPage = () => {
  return <UnderDevelopment />;
};

export default ProjectDetailsPage;
