"use server";

import { createClient } from "@/lib/supabase/server";
import { BUCKET_NAME } from "../../../constants/items.constants";
import { IAsset, IAssetPreview } from "../../../types/data";

const getFilteredAssets = async ({
  page = 1,
  pageLimit = 10,
  category,
  search,
  sort
}: {
  page?: number;
  pageLimit?: number;
  category?: string;
  search?: string;
  sort?: { id: string; desc: boolean; }[];
}) => {
  const supabase = await createClient();

  // Pagination
  const from = (page - 1) * pageLimit;
  const to = from + pageLimit - 1;

  let query = supabase.from(BUCKET_NAME).select("id, file_name, ordering, category, usage, url, created_at, updated_at", { count: "exact" }).range(from, to);

  if (search) {
    const searchPattern = `%${search}%`;
    query = query.or(`file_name.ilike.${searchPattern},usage.ilike.${searchPattern}`);
  }

  if (category) {
    const categories = category.split(",");
    query = query.in("category", categories);
  }

  // Sorting
  if (sort && sort.length > 0) {
    sort.forEach((s) => {
      const sortField = s.id === "search" ? "file_name" : s.id;
      query = query.order(sortField, { ascending: !s.desc });
    });
  } else {
    // default sort
    query = query.order("ordering", { ascending: true });
  }

  const { data, count, error } = await query;

  if (error) throw error;

  const assets = data as IAsset[];

  return {
    success: true,
    total: count || 0,
    assets,
    page,
    pageLimit,
    offset: from
  };
};

const getAllAssets = async () => {
  const supabase = await createClient();

  const allImagesQuery = supabase.from(BUCKET_NAME).select("id, file_name, url").not("ordering", "eq", 0).order("ordering", { ascending: true }).eq("category", "image");

  const allFilesQuery = supabase.from(BUCKET_NAME).select("id, file_name, url").order("ordering", { ascending: true }).eq("category", "file");

  const [allImagesResult, allFilesResult] = await Promise.all([allImagesQuery, allFilesQuery]);

  if (allImagesResult.error || allFilesResult.error) throw new Error("Failed to fetch assets");

  const data = {
    images: allImagesResult.data as IAssetPreview[],
    files: allFilesResult.data as IAssetPreview[]
  };

  return data;
};

const updateAssetById = async (id: IAsset["id"], data: Pick<IAsset, "file_name" | "usage">) => {
  const supabase = await createClient();

  const { error } = await supabase.from(BUCKET_NAME).update({
    ...data,
    updated_at: new Date().toISOString()
  }).eq("id", id);

  if (error) throw error;
};

const deleteAssetById = async (id: IAsset["id"]) => {
  const supabase = await createClient();

  const { data: deletedData, error: errorDeleteRow } = await supabase.from(BUCKET_NAME).delete().eq("id", id).select("file_path").single();

  if (errorDeleteRow) throw errorDeleteRow;

  const { error: errorDeleteFile } = await supabase.storage.from(BUCKET_NAME).remove([deletedData.file_path]);

  if (errorDeleteFile) throw errorDeleteFile;
};

const deleteSelectedAssets = async (ids: IAsset["id"][]) => {
  await Promise.all(ids.map(async (id) => deleteAssetById(id)));
};

export {
  getFilteredAssets,
  getAllAssets,
  updateAssetById,
  deleteAssetById,
  deleteSelectedAssets
};