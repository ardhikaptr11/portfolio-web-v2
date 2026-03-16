import { Fragment } from "react/jsx-runtime";
import Certifications from "../../components/views/certifications";
import Contact from "../../components/views/contact";
import Experience from "../../components/views/experience";
import Hero from "../../components/views/hero";
import Timeline from "../../components/views/journey";
import Projects from "../../components/views/projects";
import Services from "../../components/views/services";
import { JOURNEY_STEPS } from "../../constants/items.constants";
import { getAllData } from "../../lib/queries/home";
import { getTranslations } from "next-intl/server";
import { constructMetadata } from "@/lib/metadata";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const t = await getTranslations("Schema.person");

  return constructMetadata({
    locale,
    title: "Ardhika Putra - Fullstack Developer",
    description: t("description"),
  });
};

const FOUNDATION_JOURNEY = JOURNEY_STEPS.slice(0, 3);
const FUTURE_JOURNEY = JOURNEY_STEPS.slice(3);

const HomePage = async () => {
  const { profile, projects, experiences, certificates } = await getAllData();

  return (
    <Fragment>
      <Hero data={{ profile, projects }} />
      <Timeline steps={FOUNDATION_JOURNEY} />
      <Projects projects={projects} />
      <Timeline steps={FUTURE_JOURNEY} isContinuation />
      <Services />
      <Experience data={experiences} />
      <Certifications data={certificates} />
      <Contact
        contact={{ email: profile.email, phone_number: profile.phone_number }}
      />
    </Fragment>
  );
};

export default HomePage;
