"use server"

import { getCurrentDate } from "@/lib/helpers";
import { createClient } from "@/lib/supabase/server";
import { BUCKET_NAME, FOLDER_PATH } from "../../constants/items.constants";
import { IAsset, IAssetPreview } from "../../types/data";

const generateFilenameWithDate = (filename: string) => {
  const [name, ext] = filename.split(".");

  const formattedName = `${name}-${getCurrentDate()}`;

  return { formattedName, ext }
}

const uploadSingleImage = async (files: File[]) => {
  const supabase = await createClient();

  const { formattedName: fileName, ext } = generateFilenameWithDate(files[0].name);
  const filePath = `${FOLDER_PATH.image}/${fileName}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, files[0]);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  // Retrieve last ordering index for images
  const { data } = await supabase
    .from(BUCKET_NAME)
    .select("ordering")
    .eq("category", "image")
    .order("ordering", { ascending: false })
    .limit(1)
    .single();

  const lastIndex = data?.ordering ?? 0;
  const nextIndex = lastIndex + 1;

  const { error: insertError } = await supabase.from(BUCKET_NAME).insert({
    file_name: fileName,
    ordering: nextIndex,
    category: "image",
    url: publicUrl,
    file_path: filePath // reference for deleting file
  })

  if (insertError) throw insertError;
}

const batchUploadAssets = async (files: File[]) => {
  const supabase = await createClient()

  files.map(async (file) => {
    const { formattedName: fileName, ext } = generateFilenameWithDate(file.name);

    const isImage = file.type.startsWith("image/");

    const path = isImage ? FOLDER_PATH.image : FOLDER_PATH.file

    const filePath = `${path}/${fileName}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw new Error(`Error while uploading ${file.name}`);

    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    // Retrieve last ordering index
    const { data } = await supabase
      .from(BUCKET_NAME)
      .select("ordering")
      .eq("category", isImage ? "image" : "file")
      .order("ordering", { ascending: false })
      .limit(1)
      .single();

    const lastIndex = data?.ordering ?? 0
    const nextIndex = lastIndex + 1

    const { error: insertError } = await supabase.from(BUCKET_NAME).insert({
      file_name: fileName,
      ordering: nextIndex,
      category: isImage ? "image" : "file",
      url: publicUrl,
      file_path: filePath // reference for deleting file
    })

    if (insertError) throw new Error(`Error while saving ${file.name} info to database`);
  });
}

const getFilteredAssets = async ({
  page = 1,
  limit = 10,
  category,
  search,
  sort
}: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: { id: string; desc: boolean }[];
}) => {
  const supabase = await createClient();

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from(BUCKET_NAME).select("id, file_name, ordering, category, usage, url, created_at, updated_at", { count: "exact" }).range(from, to)

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
    limit,
    offset: from
  };
}

const getAllAssets = async () => {
  const supabase = await createClient();

  const allImagesQuery = await supabase.from(BUCKET_NAME).select("id, file_name, url").order("ordering", { ascending: true }).eq("category", "image")

  const allFilesQuery = await supabase.from(BUCKET_NAME).select("id, file_name, url").order("ordering", { ascending: true }).eq("category", "file")

  const [allImagesResult, allFilesResult] = await Promise.all([allImagesQuery, allFilesQuery])

  if (allImagesResult.error || allFilesResult.error) throw new Error("Failed to fetch assets");

  const data = {
    images: allImagesResult.data as IAssetPreview[],
    files: allFilesResult.data as IAssetPreview[]
  }

  return data
}

const updateAssetOrder = async (assetIds: string[]) => {
  const supabase = await createClient();

  // Updating asset ordering in parallel
  const updates = assetIds.map((assetId, index) =>
    supabase
      .from(BUCKET_NAME)
      .update({ ordering: index + 1 })
      .eq("id", assetId)
  );

  await Promise.all(updates);
};

const updateAssetById = async (id: IAsset["id"], data: Pick<IAsset, "file_name" | "usage">) => {
  const supabase = await createClient()

  const { error } = await supabase.from(BUCKET_NAME).update({
    ...data,
    updated_at: Date.now()
  }).eq("id", id)

  if (error) throw error;
}

const deleteAssetById = async (id: IAsset["id"]) => {
  const supabase = await createClient()

  const { data: deletedData, error: errorDeleteRow } = await supabase.from(BUCKET_NAME).delete().eq("id", id).select("file_path").single()

  if (errorDeleteRow) throw errorDeleteRow;

  const { error: errorDeleteFile } = await supabase.storage.from(BUCKET_NAME).remove([deletedData.file_path])

  if (errorDeleteFile) throw errorDeleteFile;
}

const deleteSelectedAssets = async (ids: IAsset["id"][]) => {
  const supabase = await createClient();

  const { error: deleteError } = await supabase.from("assets").delete().in("id", ids)

  if (deleteError) throw deleteError;
}

const downloadAssetById = async (id: IAsset["id"]) => {
  const supabase = await createClient()

  const { data: asset } = await supabase.from("assets").select("file_name, file_path").eq("id", id).single()

  if (!asset) throw new Error("File not found");

  const { data: fileToDownload, error: errorDownload } = await supabase
    .storage
    .from(BUCKET_NAME)
    .download(asset.file_path)

  if (errorDownload) throw errorDownload;

  return { fileToDownload, fileName: asset.file_name };
}

export {
  batchUploadAssets, deleteAssetById, deleteSelectedAssets, downloadAssetById, getAllAssets, getFilteredAssets, updateAssetById, updateAssetOrder, uploadSingleImage
};

