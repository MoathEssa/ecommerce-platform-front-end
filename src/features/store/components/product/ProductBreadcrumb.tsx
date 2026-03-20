import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbDto } from "../../types";

interface ProductBreadcrumbProps {
  breadcrumbs: BreadcrumbDto[];
  productTitle: string;
}

export default function ProductBreadcrumb({
  breadcrumbs,
  productTitle,
}: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground overflow-x-auto">
      <Link
        to="/store"
        className="shrink-0 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <Link
        to="/store/products"
        className="shrink-0 hover:text-foreground transition-colors"
      >
        Products
      </Link>
      {breadcrumbs.map((crumb) => (
        <span key={crumb.slug} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to={`/store/products?categorySlug=${crumb.slug}`}
            className="shrink-0 hover:text-foreground transition-colors"
          >
            {crumb.name}
          </Link>
        </span>
      ))}
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate font-medium text-foreground">
        {productTitle}
      </span>
    </nav>
  );
}
