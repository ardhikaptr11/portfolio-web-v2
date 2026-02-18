import { Fragment } from "react/jsx-runtime";
import Certifications from "../components/views/certifications";
import Contact from "../components/views/contact";
import Experiences from "../components/views/experiences";
import Hero from "../components/views/hero";
import Timeline from "../components/views/journey";
import Projects from "../components/views/projects";
import Services from "../components/views/services";
import { JOURNEY_STEPS } from "../constants/items.constants";
import { getAllData } from "../lib/queries/home";

const FOUNDATION_JOURNEY = JOURNEY_STEPS.slice(0, 3);
const FUTURE_JOURNEY = JOURNEY_STEPS.slice(3);

const HomePage = async () => {
  const { profile, projects, experiences, certificates } = await getAllData();

  return (
    <Fragment>
      <Hero data={profile} />
      <Timeline steps={FOUNDATION_JOURNEY} />
      <Projects projects={projects} />
      <Timeline steps={FUTURE_JOURNEY} isContinuation />
      <Services />
      <Experiences experiences={experiences} />
      <Certifications certificates={certificates} />
      <Contact contact={{ email: profile.email, phone: profile.phone }} />
    </Fragment>
  );
};

export default HomePage;
