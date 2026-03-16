import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsString,
} from "nuqs/server";
import z from "zod";

export interface ISortOrder {
  id: string;
  desc: boolean;
}

const SortOrderSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  }),
);

const baseSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(""),
};

export const projectSearchParams = {
  ...baseSearchParams,
  perPage: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(""),
  role: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  tech_stack: parseAsArrayOf(parseAsString).withDefault([]),
};

export const projectSearchParamsCache =
  createSearchParamsCache(projectSearchParams);
export const projectSerialize = createSerializer(projectSearchParams);
