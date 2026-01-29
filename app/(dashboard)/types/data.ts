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

export type {
  IAsset,
  IAssetPreview,
  IProject
};