import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Tag, Package } from "lucide-react";
import { Input } from "@shared/ui/input";
import { useGetSearchSuggestionsQuery } from "../../api/storeCatalogApi";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: suggestions } = useGetSearchSuggestionsQuery(
    { q: query, limit: 6 },
    { skip: query.length < 2 },
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/store/products?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: {
    type: string;
    slug: string;
  }) => {
    setOpen(false);
    setQuery("");
    if (suggestion.type === "product") {
      navigate(`/store/products/${suggestion.slug}`);
    } else {
      navigate(`/store/products?categorySlug=${suggestion.slug}`);
    }
  };

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search products, categories, brands..."
          className="pl-10 pr-10 h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:border-primary/30 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border bg-popover shadow-xl overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={`${s.type}-${s.slug}`}
              onClick={() => handleSuggestionClick(s)}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-accent text-left transition-colors"
            >
              {s.type === "product" ? (
                <Package className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="truncate font-medium">{s.title}</span>
              <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                {s.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
