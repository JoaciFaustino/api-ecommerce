export const normalizeQueryStringArray = (
  queryParams?: string | string[]
): string[] => {
  if (!queryParams) {
    return [];
  }

  const params = Array.isArray(queryParams) ? queryParams : [queryParams];

  const paramsDecodeds = params.map((param) => decodeURIComponent(param));

  return paramsDecodeds;
};

export const normalizeQueryString = (queryParam: string | string[]): string => {
  const lastIndex = queryParam.length - 1;

  const lastValue: string = Array.isArray(queryParam)
    ? queryParam[lastIndex]
    : queryParam;

  return lastValue;
};

export const getPrevAndNextUrl = (
  actualUrl: string,
  actualPage: number,
  maxPages: number
): { nextUrl: string | null; prevUrl: string | null } => {
  const url = new URL(actualUrl);

  url.searchParams.delete("page");
  url.searchParams.set("page", (actualPage + 1).toString());
  const nextUrl: string | null =
    maxPages !== actualPage ? url.toString() : null;

  url.searchParams.delete("page");
  url.searchParams.set("page", (actualPage - 1).toString());
  const prevUrl: string | null = actualPage > 1 ? url.toString() : null;

  return {
    nextUrl,
    prevUrl
  };
};
