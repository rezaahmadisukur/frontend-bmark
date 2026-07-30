import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useBookmarkFilters() {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    tag: parseAsString.withDefault(""),
    collectionId: parseAsString.withDefault(""),
    showFavorites: parseAsBoolean.withDefault(false),
    showRecent: parseAsBoolean.withDefault(false)
  });

  return { filters, setFilters };
}
