import { ContentArea } from "@/app/(root)/components/views/Projects/content-area";
import Hero from "@/app/(root)/components/views/Projects/hero";
import { getSelectedProject } from "@/app/(root)/lib/queries/projects";
import { JsonLd } from "@/components/json-ld";
import { RichTextRenderer } from "@/components/rich-text-renderer";
import { constructMetadata } from "@/lib/metadata";
import { getProjectDetailsSchemaGraph } from "@/lib/schema";
import { notFound } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const { locale, slug } = await params;

  const project = await getSelectedProject(slug);

  const description =
    locale === "id" ? project.description_id : project.description;

  return constructMetadata({
    title: project.title,
    description: description,
    locale: locale,
    pathname: `/projects/${slug}`,
    image: project.thumbnail_url,
  });
};

const ProjectDetailsPage = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const { locale, slug } = await params;

  const project = await getSelectedProject(slug);

  if (!project) notFound();

  const projectDetailsSchemaGraph = await getProjectDetailsSchemaGraph(project);

  const overview = locale === "id" ? project.overview_id : project.overview;

  return (
    <Fragment>
      <JsonLd schema={projectDetailsSchemaGraph} />
      <Hero title={project.title} url={project.thumbnail_url} />
      <ContentArea project={project}>
        <RichTextRenderer dataToRender={overview} />
      </ContentArea>
    </Fragment>
  );
};

export default ProjectDetailsPage;
