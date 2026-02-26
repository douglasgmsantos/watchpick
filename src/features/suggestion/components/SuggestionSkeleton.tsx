import { Card, Skeleton } from '@/components/ui';

export function SuggestionSkeleton() {
  return (
    <Card className="w-full max-w-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="w-full sm:w-48 h-72 sm:h-auto rounded-none" />
        <div className="flex-1 p-6 space-y-4">
          <Skeleton variant="text" className="h-6 w-3/4" />
          <Skeleton variant="text" className="h-4 w-1/3" />
          <Skeleton variant="text" className="h-4 w-1/4" />
          <div className="space-y-2">
            <Skeleton variant="text" className="h-3 w-full" />
            <Skeleton variant="text" className="h-3 w-full" />
            <Skeleton variant="text" className="h-3 w-2/3" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton variant="circular" className="w-8 h-8" />
            <Skeleton variant="circular" className="w-8 h-8" />
            <Skeleton variant="circular" className="w-8 h-8" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </Card>
  );
}
