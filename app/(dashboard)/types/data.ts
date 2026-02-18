import { ISocialLinks } from "./user";

interface IAsset {
  id: string;
  file_name: string;
  ordering: number;
  category: "image" | "file";
  usage: string;
  url: string;
  created_at: Date;
  updated_at: Date;
}

interface IAssetPreview extends Pick<IAsset, "id" | "file_name" | "url"> { }

interface IProject {
  id: string;
  asset_id: string;
  asset_url: string;
  file_name: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  tech_stack: string[];
  urls: ISocialLinks;
  created_at: Date;
  updated_at: Date;
}

enum WORK_TYPE {
  ONLINE = "online",
  OFFLINE = "offline",
}

enum WORK_CATEGORY {
  FULL_TIME = "full_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  FREELANCE = "freelance",
}

interface IExperience {
  id: string;
  role: string;
  organization: string;
  location: string;
  work_type: WORK_TYPE;
  work_category: WORK_CATEGORY;
  responsibilities: string[];
  start_date: Date;
  is_current?: boolean;
  end_date: Date | null;
  duration?: string;
  related_asset?: string | null;
  file_name?: string;
}

export type {
  IAsset,
  IAssetPreview,
  IProject,
  IExperience,
  WORK_CATEGORY
};