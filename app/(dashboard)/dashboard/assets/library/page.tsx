import SortableGallery from "@/app/(dashboard)/components/views/Assets/sortable-gallery";
import { getAllAssets } from "@/app/(dashboard)/lib/queries/assets/actions";
import { constructMetadata } from "@/lib/metadata";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = constructMetadata({
  title: "Asset Library",
  pathname: "/dashboard/assets/library",
});

const ImageGalleryPage = async ({ searchParams }: PageProps) => {
  const { category } = await searchParams;

  const data = await getAllAssets();

  const activeTab = !category ? "image" : "file";

  return <SortableGallery data={data} activeTab={activeTab} />;
};

export default ImageGalleryPage;
