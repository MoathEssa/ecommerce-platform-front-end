import { useSearchParams } from "react-router-dom";
import { PackageCheck } from "lucide-react";

export default function AvailabilityFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const inStock = searchParams.get("inStock") === "true";

  const toggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) params.set("inStock", "true");
    else params.delete("inStock");
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <PackageCheck className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Availability</h3>
      </div>
      <label className="flex items-center gap-3 cursor-pointer group rounded-lg px-2 py-2 -mx-2 hover:bg-accent transition-colors">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => toggle(e.target.checked)}
            className="peer h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm text-foreground block leading-tight">
            In stock only
          </span>
          <span className="text-[11px] text-muted-foreground">
            Hide out-of-stock items
          </span>
        </div>
      </label>
    </div>
  );
}
