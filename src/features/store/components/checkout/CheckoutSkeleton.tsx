import { Skeleton } from "@shared/ui/skeleton";

export default function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
