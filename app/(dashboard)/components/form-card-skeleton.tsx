import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FormCardSkeleton = () => {
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <Skeleton className="h-8 w-48" /> {/* Title */}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Image upload area skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" /> {/* Label */}
            <Skeleton className="h-48 w-full rounded-lg" />{" "}
            {/* Image Preview */}
          </div>

          {/* Image Dropdown */}
          <Skeleton className="h-10 w-full" />

          {/* Name / Title */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-32 w-full" /> {/* Textarea */}
          </div>

          {/* Slug */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* URLs */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" /> {/* Label */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormCardSkeleton;
