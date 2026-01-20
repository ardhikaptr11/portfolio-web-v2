import SortableGallery from "@/app/(dashboard)/components/views/Assets/sortable-gallery";
import { getAllAssets } from "@/app/(dashboard)/lib/queries/assets";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ImageGalleryPage = async ({ searchParams }: PageProps) => {
  const { category } = await searchParams;

  const data = await getAllAssets();

  const activeTab = !category ? "image" : "file";

  return <SortableGallery data={data} activeTab={activeTab} />;
};

export default ImageGalleryPage;
