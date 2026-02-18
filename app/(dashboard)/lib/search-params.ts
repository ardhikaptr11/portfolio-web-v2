import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsString
} from 'nuqs/server';
import z from 'zod';

export interface ISortOrder {
  id: string;
  desc: boolean;
};

const SortOrderSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  })
);

const baseSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(""),
}

export const searchParams = {
  ...baseSearchParams,
  sort: parseAsJson<ISortOrder[]>((value) => SortOrderSchema.parse(value)).withDefault([]),
  category: parseAsString.withDefault(""),
};

export const experienceSearchParams = {
  ...baseSearchParams,
  perPage: parseAsInteger.withDefault(5),
  sort: parseAsString.withDefault(""),
  duration: parseAsArrayOf(parseAsString).withDefault([]),
  work_type: parseAsString.withDefault(""), // online or offline
  work_category: parseAsArrayOf(parseAsString).withDefault([])
}

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

export const experienceSearchParamsCache = createSearchParamsCache(experienceSearchParams);
export const experienceSerialize = createSerializer(experienceSearchParams);