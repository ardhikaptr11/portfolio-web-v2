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

interface IAssetPreview extends Pick<IAsset, "id" | "file_name" | "url"> {}

export type {
  IAsset,
  IAssetPreview,
}