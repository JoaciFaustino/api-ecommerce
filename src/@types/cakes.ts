export type SortByCakes =
  | { bougths: "descending" }
  | { created_at: "descending" }
  | { pricing: "descending" }
  | { pricing: "ascending" }
  | null;
