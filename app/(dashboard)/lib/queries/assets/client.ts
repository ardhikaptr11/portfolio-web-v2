"use client";

import { createClient } from "@/lib/supabase/client";
import { generateFilenameWithDatetime } from "@/lib/utils";
import { BUCKET_NAME, FOLDER_PATH } from "../../../constants/items.constants";
import { IAsset } from "../../../types/data";

const supabase = createClient();

const uploadSingleImage = async (files: File[]) => {
  const { formattedName: fileName, ext } = generateFilenameWithDatetime(files[0].name);
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
  const [lastImgRes, lastFileRes] = await Promise.all([
    supabase.from(BUCKET_NAME).select("ordering").eq("category", "image").order("ordering", { ascending: false }).limit(1).single(),
    supabase.from(BUCKET_NAME).select("ordering").eq("category", "file").order("ordering", { ascending: false }).limit(1).single()
  ]);

  let currentImgIndex = lastImgRes.data?.ordering ?? 0;
  let currentFileIndex = lastFileRes.data?.ordering ?? 0;

  let addedImgCount = 0;
  let addedFileCount = 0;

  await Promise.all(files.map(async (file) => {
    const isImage = file.type.startsWith("image/");
    const { formattedName: fileName, ext } = generateFilenameWithDatetime(file.name);
    const path = isImage ? FOLDER_PATH.image : FOLDER_PATH.file
    const filePath = `${path}/${fileName}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw new Error(`Error while uploading ${file.name}`);

    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    let nextIndex;
    if (isImage) {
      addedImgCount++;
      nextIndex = currentImgIndex + addedImgCount;
    } else {
      addedFileCount++;
      nextIndex = currentFileIndex + addedFileCount;
    }

    const { error: insertError } = await supabase.from(BUCKET_NAME).insert({
      file_name: fileName,
      ordering: nextIndex,
      category: isImage ? "image" : "file",
      url: publicUrl,
      file_path: filePath // reference for deleting file
    })

    if (insertError) throw new Error(`Error while saving ${file.name} info to database`);
  }))
}

const downloadAsset = async ({ id, file_name }: { id?: IAsset["id"], file_name?: IAsset["file_name"] }) => {
  const { data: asset, error } = id ? await supabase.from("assets").select("file_name, file_path").eq("id", id).single() : await supabase.from("assets").select("file_name, file_path").eq("file_name", file_name).single()

  if (!asset) throw error;

  const { data: fileToDownload, error: errorDownload } = await supabase
    .storage
    .from(BUCKET_NAME)
    .download(asset.file_path)

  if (errorDownload) throw errorDownload;

  return { fileToDownload, fileName: asset.file_name };
}

const getTotalAssets = async () => {
  const supabase = createClient();

  const countImageAssets = supabase
    .from("assets")
    .select("*", { count: "exact", head: true })
    .eq("category", "image");

  const countFileAssets = supabase
    .from("assets")
    .select("*", { count: "exact", head: true })
    .eq("category", "image");

  const [imageRes, fileRes] = await Promise.all([
    countImageAssets,
    countFileAssets,
  ]);

  if (imageRes.error || fileRes.error)
    throw new Error("Failed to count total assets");

  const { count: totalImageAssets } = imageRes;
  const { count: totalFileAssets } = fileRes;

  return {
    totalImageAssets,
    totalFileAssets,
  };
};

const getALlImages = async () => {
  const { data: images, error } = await supabase
    .from("assets")
    .select("id, file_name, url")
    .eq("category", "image")
    .not("ordering", "eq", 0);

  if (error) throw error;

  return images;
};

const updateAssetOrder = async (assetIds: string[]) => {
  // Updating asset ordering in parallel
  const updates = assetIds.map((assetId, index) =>
    supabase
      .from(BUCKET_NAME)
      .update({ ordering: index + 1 })
      .eq("id", assetId)
  );

  await Promise.all(updates);
};

export { batchUploadAssets, downloadAsset, uploadSingleImage, getTotalAssets, getALlImages, updateAssetOrder };
