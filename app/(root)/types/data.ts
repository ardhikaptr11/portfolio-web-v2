import { WORK_CATEGORY } from "@/app/(dashboard)/types/data";
import { ISocialLinks } from "@/app/(dashboard)/types/user";

interface IHero {
  email: string;
  phone: string;
  name: string;
  motto: string;
  tagline: string;
  tagline_id: string;
  roles: { id: string, text: string; }[];
  skills: string[];
  social_links: ISocialLinks;
  hero_img: string;
  cv_asset: string;
}

interface IProject {
  id: string;
  title: string;
  thumbnail_url: string;
  slug: string;
  description: string;
  description_id: string;
  overview: string;
  tech_stack: string[];
  urls: { demo: string, github: string; };
}

interface IExperience {
  role: string;
  organization: string;
  location: string;
  work_type: string;
  work_category: WORK_CATEGORY;
  responsibilities: string[];
  responsibilities_id: string[];
  start_date: Date;
  end_date: Date | null;
  duration: string;
  related_asset_url: string | null;
}

interface ICertificate {
  name: string;
  url: string;
}

export type { IHero, IProject, IExperience, ICertificate };