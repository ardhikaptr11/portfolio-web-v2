"use client";

import PageContainer from "@/app/(dashboard)/components/layout/page-container";
import { MAX_TOTAL_FILE } from "@/app/(dashboard)/constants/items.constants";
import { useIsMobile } from "@/app/(dashboard)/hooks/use-mobile";

import {
  downloadAsset,
  updateAssetOrder,
} from "@/app/(dashboard)/lib/queries/assets/client";
import { IAssetPreview } from "@/app/(dashboard)/types/data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Heading } from "../../heading";

const SortableGallery = ({
  data,
  activeTab,
}: {
  data: { images: IAssetPreview[]; files: IAssetPreview[] };
  activeTab: string;
}) => {
  const pathname = usePathname();
  const { images, files } = data;
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (value: string) => {
    const newUrl =
      value === "image" ? pathname : `${pathname}?category=${value}`;

    window.history.replaceState(null, "", newUrl);
    setCurrentTab(value);
  };

  // Images state
  const [allImages, setAllImages] = useState(images);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Files state
  const [allFiles, setAllFiles] = useState(files);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const isMobile = useIsMobile();

  const handleChangeOrderImage = async (newItemIds: string[]) => {
    // 1. Updating UI instantly (Optimistic Update)
    const newOrderedImages = newItemIds
      .map((id) => allImages.find((img) => img.id === id))
      .filter((img): img is IAssetPreview => !!img);

    setAllImages(newOrderedImages);

    // 2. Save to database
    try {
      await updateAssetOrder(newItemIds);
    } catch (error) {
      toast.error("Failed to reorder image position", {
        description: (error as Error).message,
      });
      setAllImages(images);
    }
  };

  const handleChangeOrderFile = async (newItemIds: string[]) => {
    // 1. Updating UI instantly (Optimistic Update)
    const newOrderedFiles = newItemIds
      .map((id) => allFiles.find((file) => file.id === id))
      .filter((file): file is IAssetPreview => !!file);

    setAllFiles(newOrderedFiles);

    // 2. Save to database
    try {
      await updateAssetOrder(newItemIds);
    } catch (error) {
      toast.error("Failed to reorder image position", {
        description: (error as Error).message,
      });
      setAllImages(images);
    }
  };

  const handleDownloadFile = useCallback(async (assetId: string) => {
    try {
      const { fileToDownload, fileName } = await downloadAsset({ id: assetId });

      const url = window.URL.createObjectURL(fileToDownload);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download file", {
        description: (error as Error).message,
        position: "top-right",
      });
    }
  }, []);

  return (
    <PageContainer scrollable>
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="file">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <div className="flex w-full flex-col space-y-8">
            <div className="flex items-end justify-between">
              <Heading
                title="Image Library"
                description="All uploaded images can be found here. Drag and drop to reorder them."
              />
              <p className="text-muted-foreground">
                {allImages.length}/{MAX_TOTAL_FILE.image}
              </p>
            </div>

            {allImages.length !== 0 ? (
              <Sortable
                value={allImages?.map((item) => item.id)}
                onValueChange={handleChangeOrderImage}
                getItemValue={(item) => item}
                strategy="grid"
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                onDragStart={(event) =>
                  setActiveImageId(event.active.id as string)
                }
                onDragEnd={() => setActiveImageId(null)}
              >
                {allImages.map((item) => (
                  <SortableItem key={item.id} value={item.id}>
                    <div className="group relative aspect-video transition-all duration-200 hover:z-10 data-[dragging=true]:z-99">
                      <Image
                        fill
                        src={item.url}
                        alt={`Thumbnail of ${item.file_name}`}
                        className="size-full rounded-lg border object-cover transition-transform group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
                        {allImages.length !== 1 && (
                          <SortableItemHandle className="group absolute start-2 top-2 opacity-0 group-hover:opacity-100">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-6 cursor-grab rounded-full group-active:cursor-grabbing"
                            >
                              <Icons.gripVertical className="size-3.5" />
                            </Button>
                          </SortableItemHandle>
                        )}
                        {!isMobile && (
                          <Button
                            onClick={() => setSelectedImage(item.url!)}
                            variant="secondary"
                            size="icon"
                            className="size-7"
                          >
                            <ZoomInIcon className="opacity-100/80 size-5" />
                          </Button>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/30 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="truncate text-xs font-medium">
                          {item.file_name}
                        </p>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </Sortable>
            ) : (
              <div className="flex-col-center h-full space-y-1 text-muted-foreground">
                <div className="flex-center size-10 rounded-full border-2 border-muted-foreground">
                  <Icons.imageOff className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg">No image uploaded</h3>
              </div>
            )}
          </div>

          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative flex size-full justify-center">
                <Image
                  fill
                  src={selectedImage}
                  alt="Preview"
                  className="mx-auto max-w-3/4 scale-90 rounded-lg object-cover"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  onClick={() => setSelectedImage(null)}
                  variant="secondary"
                  size="icon"
                  className="absolute end-2 top-2 size-7 p-0"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="file">
          <div className="flex w-full flex-col space-y-8">
            <div className="flex items-end justify-between">
              <Heading
                title="File Library"
                description="All uploaded files can be found here. Drag and drop to reorder them."
              />
              <p className="text-muted-foreground">
                {allFiles.length}/{MAX_TOTAL_FILE.file}
              </p>
            </div>

            {allFiles.length !== 0 ? (
              <Sortable
                value={allFiles?.map((item) => item.id)}
                onValueChange={handleChangeOrderFile}
                getItemValue={(item) => item}
                strategy="grid"
                className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                onDragStart={(event) =>
                  setActiveFileId(event.active.id as string)
                }
                onDragEnd={() => setActiveFileId(null)}
              >
                {allFiles.map((item) => (
                  <SortableItem key={item.id} value={item.id}>
                    <div className="relative overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:z-10 data-[dragging=true]:z-99">
                      <div className="group relative aspect-square border-border bg-muted">
                        <div className="flex h-full items-center justify-center text-muted-foreground/80">
                          <Icons.file className="size-8 group-hover:opacity-0" />
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
                          {allFiles.length !== 1 && (
                            <SortableItemHandle className="group absolute start-2 top-2 opacity-0 group-hover:opacity-100">
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-6 cursor-grab rounded-full group-active:cursor-grabbing"
                              >
                                <Icons.gripVertical className="size-3.5" />
                              </Button>
                            </SortableItemHandle>
                          )}
                          <Button
                            onClick={() => handleDownloadFile(item.id)}
                            variant="secondary"
                            size="icon"
                            className="size-7 hover:bg-background/30"
                          >
                            <Icons.download className="opacity-100/80 size-5" />
                          </Button>
                        </div>

                        {/* File Info */}
                        {/* <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/30 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="truncate text-xs font-medium">
                            {item.file_name}
                          </p>
                        </div> */}
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-medium">
                          {item.file_name}
                        </p>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </Sortable>
            ) : (
              <div className="flex-col-center h-full space-y-1 text-muted-foreground">
                <div className="flex-center size-10 rounded-full border-2 border-muted-foreground">
                  <Icons.fileOff className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg">No file uploaded</h3>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default SortableGallery;
