import { Icons } from "@/components/icons";
import Image from "next/image";

const ImagePreview = ({ previewUrl }: { previewUrl: string }) => {
  return previewUrl ? (
    <div className="relative aspect-3/2 w-full sm:aspect-video">
      <Image
        fill
        src={previewUrl}
        alt="Cover"
        className="rounded-lg object-cover"
      />
    </div>
  ) : (
    <div
      className={
        "flex w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-4 text-center sm:aspect-video md:p-0"
      }
    >
      <div className="rounded-full bg-primary/10 p-2 md:p-4">
        <Icons.photo className="size-8 max-sm:size-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Thumbnail Image</h3>
        <p className="text-sm text-muted-foreground">
          Select one of the option below to see the preview
        </p>
      </div>
    </div>
  );
};

export default ImagePreview;
