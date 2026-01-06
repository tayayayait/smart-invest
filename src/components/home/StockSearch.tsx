import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { strings } from "@/data/strings.ko";
import { useSymbolSearch } from "@/hooks/useSymbolSearch";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { env } from "@/lib/env";

export function StockSearch() {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 300);
  const navigate = useNavigate();
  const search = useSymbolSearch(debounced, 6);

  const results = useMemo(() => search.items, [search.items]);
  const showEmpty = debounced.length >= 2 && !search.isLoading && results.length === 0;

  const handleSelect = (symbol: string) => {
    navigate(`/asset/${encodeURIComponent(symbol)}`);
  };

  return (
    <section className="rounded-lg bg-card p-4 shadow-card animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-4 w-4 text-primary" />
        <h3 className="text-h3 font-semibold text-foreground">
          {strings.home.stockSearchTitle}
        </h3>
      </div>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={strings.home.stockSearchPlaceholder}
      />

      {!env.finnhubApiKey && (
        <p className="mt-2 text-caption text-muted-foreground">
          {strings.home.stockSearchNoKey}
        </p>
      )}

      {search.isLoading && debounced.length >= 2 && (
        <p className="mt-2 text-caption text-muted-foreground">
          {strings.home.stockSearchLoading}
        </p>
      )}

      {showEmpty && (
        <p className="mt-2 text-caption text-muted-foreground">
          {strings.home.stockSearchEmpty}
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-3 space-y-2">
          {results.map((item) => (
            <button
              key={`${item.symbol}-${item.displaySymbol}`}
              className="w-full rounded-lg bg-accent/40 px-3 py-2 text-left transition-colors hover:bg-accent"
              onClick={() => handleSelect(item.symbol)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-caption font-medium text-foreground">
                  {item.displaySymbol || item.symbol}
                </span>
                <span className="text-[10px] text-muted-foreground">{item.type}</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

