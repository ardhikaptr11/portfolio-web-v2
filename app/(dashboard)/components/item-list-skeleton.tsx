import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ItemListSkeleton = ({ cardCount }: { cardCount: number }) => {
  return (
    <div className="space-y-4">
      <Card className="h-35">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-52" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: cardCount }).map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-18" />
            ))}
          </div>
        </CardContent>
      </Card>

      {Array.from({ length: cardCount }).map((_, idx) => (
        <div className="lg:col-span-1" key={idx}>
          <Card>
            <CardContent className="space-y-3 px-6">
              <div className="flex flex-col items-start justify-between sm:flex-row">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex flex-col max-sm:items-start items-end gap-2">
                  <Skeleton className="h-6 w-52" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton className="h-4 w-64" key={idx} />
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ItemListSkeleton;
