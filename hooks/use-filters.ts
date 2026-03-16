"use client";

import { useCallback, useMemo, useTransition } from "react";
import { UseQueryStateOptions, useQueryStates } from "nuqs";
import { experienceSearchParams } from "../app/(dashboard)/lib/search-params";
import { useDebouncedCallback } from "./use-debounced-callback";
import {
  DEBOUNCE_MS,
  PAGE_KEY,
  PER_PAGE_KEY,
  THROTTLE_MS,
} from "../app/(dashboard)/constants/items.constants";
import { capitalize, slugToTitle } from "@/lib/helpers";
import { projectSearchParams } from "@/app/(root)/lib/search-params";

export const useExperienceFilters = () => {
  const [isPending, startTransition] = useTransition();

  const baseQueryStateOptions = useMemo<
    Omit<UseQueryStateOptions<string>, "parse">
  >(
    () => ({
      history: "replace",
      scroll: false,
      shallow: false,
      throttleMs: THROTTLE_MS,
      startTransition,
    }),
    [startTransition],
  );

  const persistentQueryStateOptions = useMemo(
    () => ({
      ...baseQueryStateOptions,
      clearOnDefault: false,
    }),
    [baseQueryStateOptions],
  );

  const [filters, setFilters] = useQueryStates(
    experienceSearchParams,
    baseQueryStateOptions,
  );

  const setSort = useCallback(
    (value: string) => {
      void setFilters(
        { [PAGE_KEY]: 1, sort: value },
        persistentQueryStateOptions,
      );
    },
    [setFilters, persistentQueryStateOptions],
  );

  const resetFilters = useCallback(() => {
    void setFilters(
      {
        page: 1,
        search: null,
        duration: null,
        work_type: null,
        work_category: null,
        sort: null,
      },
      persistentQueryStateOptions,
    );
  }, [setFilters, persistentQueryStateOptions]);

  const debouncedSetFilters = useDebouncedCallback(
    (value: Partial<typeof filters>) => {
      const cleanValue = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, v === "" ? null : v]),
      );

      void setFilters(
        { [PAGE_KEY]: 1, ...cleanValue },
        persistentQueryStateOptions,
      );
    },
    DEBOUNCE_MS,
  );

  const setPage = useCallback(
    (newPage: number) => {
      void setFilters({ [PAGE_KEY]: newPage }, persistentQueryStateOptions);
    },
    [setFilters, persistentQueryStateOptions],
  );

  const setPerPage = useCallback(
    (newPerPage: number) => {
      void setFilters(
        { [PAGE_KEY]: 1, [PER_PAGE_KEY]: newPerPage },
        persistentQueryStateOptions,
      );
    },
    [setFilters, persistentQueryStateOptions],
  );

  const toggleFilter = useCallback(
    (key: "duration" | "work_category", value: string) => {
      const current = filters[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      void setFilters(
        { [PAGE_KEY]: 1, [key]: next.length > 0 ? next : null },
        persistentQueryStateOptions,
      );
    },
    [filters, setFilters, persistentQueryStateOptions],
  );

  const setWorkType = useCallback(
    (value: string) => {
      const next = filters.work_type === value ? null : value;
      void setFilters(
        { [PAGE_KEY]: 1, work_type: next },
        persistentQueryStateOptions,
      );
    },
    [filters.work_type, setFilters, persistentQueryStateOptions],
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.work_type) count++;
    count += filters.duration.length;
    count += filters.work_category.length;
    return count;
  }, [filters]);

  const activeChips = useMemo(() => {
    const chips: {
      id: string;
      label: string;
      key: keyof typeof experienceSearchParams;
      value: any;
      type: "string" | "array";
    }[] = [];

    if (filters.search) {
      chips.push({
        id: "search",
        label: `Search: "${filters.search}"`,
        key: "search",
        value: null,
        type: "string",
      });
    }

    if (filters.duration) {
      filters.duration.forEach((val) => {
        const labelMap: Record<string, string> = {
          "lt-3": "< 3 Months",
          "3-6": "3-6 Months",
          "gt-6": "> 6 Months",
          "gt-36": "3+ Years",
        };
        chips.push({
          id: val,
          label: `Duration: ${labelMap[val]}`,
          key: "duration",
          value: val,
          type: "array",
        });
      });
    }

    if (filters.work_type) {
      chips.push({
        id: "work-type",
        label: `Type: ${capitalize(filters.work_type)}`,
        key: "work_type",
        value: null,
        type: "string",
      });
    }

    if (filters.work_category) {
      filters.work_category.forEach((val) => {
        chips.push({
          id: val,
          label: `Category: ${slugToTitle(val)}`,
          key: "work_category",
          value: val,
          type: "array",
        });
      });
    }

    return chips;
  }, [filters]);

  const removeChip = useCallback(
    (chip: {
      key: keyof typeof filters;
      value: any;
      type: "string" | "array";
    }) => {
      if (chip.type === "array") {
        const currentValues = filters[chip.key] as string[];
        const next = currentValues.filter((v) => v !== chip.value);
        void setFilters(
          { [chip.key]: next.length > 0 ? next : null, page: 1 },
          persistentQueryStateOptions,
        );
      } else {
        void setFilters(
          { [chip.key]: null, page: 1 },
          persistentQueryStateOptions,
        );
      }
    },
    [filters, setFilters, persistentQueryStateOptions],
  );

  return {
    filters,
    setSort,
    setFilters,
    debouncedSetFilters,
    setPage,
    setPerPage,
    toggleFilter,
    setWorkType,
    isPending,
    activeFiltersCount,
    activeChips,
    removeChip,
    resetFilters,
  };
};

export const useProjectFilters = () => {
  const [isPending, startTransition] = useTransition();

  const baseQueryStateOptions = useMemo<
    Omit<UseQueryStateOptions<string>, "parse">
  >(
    () => ({
      history: "replace",
      scroll: false,
      shallow: false,
      throttleMs: THROTTLE_MS,
      startTransition,
    }),
    [startTransition],
  );

  const persistentQueryStateOptions = useMemo(
    () => ({
      ...baseQueryStateOptions,
      clearOnDefault: false,
    }),
    [baseQueryStateOptions],
  );

  const [filters, setFilters] = useQueryStates(
    projectSearchParams,
    baseQueryStateOptions,
  );

  const setSort = useCallback(
    (value: string) => {
      void setFilters(
        { [PAGE_KEY]: 1, sort: value },
        persistentQueryStateOptions,
      );
    },
    [setFilters, persistentQueryStateOptions],
  );

  const resetFilters = useCallback(() => {
    void setFilters(
      {
        page: 1,
        search: null,
        role: null,
        status: null,
        tech_stack: null,
        sort: null,
      },
      persistentQueryStateOptions,
    );
  }, [setFilters, persistentQueryStateOptions]);

  const debouncedSetFilters = useDebouncedCallback(
    (value: Partial<typeof filters>) => {
      const cleanValue = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, v === "" ? null : v]),
      );

      void setFilters(
        { [PAGE_KEY]: 1, ...cleanValue },
        persistentQueryStateOptions,
      );
    },
    DEBOUNCE_MS,
  );

  const setPage = useCallback(
    (newPage: number) => {
      void setFilters({ [PAGE_KEY]: newPage }, persistentQueryStateOptions);
    },
    [setFilters, persistentQueryStateOptions],
  );

  const setPerPage = useCallback(
    (newPerPage: number) => {
      void setFilters(
        { [PAGE_KEY]: 1, [PER_PAGE_KEY]: newPerPage },
        persistentQueryStateOptions,
      );
    },
    [setFilters, persistentQueryStateOptions],
  );

  const toggleFilter = useCallback(
    (key: "tech_stack", value: string) => {
      const current = filters[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      void setFilters(
        { [PAGE_KEY]: 1, [key]: next.length > 0 ? next : null },
        persistentQueryStateOptions,
      );
    },
    [filters, setFilters, persistentQueryStateOptions],
  );

  const setFilteredQuery = useCallback(
    (query: "role" | "status", value: string) => {
      const next =
        filters.status === value || filters.role === value ? null : value;

      if (query === "status") {
        void setFilters(
          { [PAGE_KEY]: 1, status: next },
          persistentQueryStateOptions,
        );
      }

      if (query === "role") {
        void setFilters(
          { [PAGE_KEY]: 1, role: next },
          persistentQueryStateOptions,
        );
      }
    },
    [filters.status, setFilters, persistentQueryStateOptions],
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.role) count++;
    count += filters.tech_stack.length;
    return count;
  }, [filters]);

  const activeChips = useMemo(() => {
    const chips: {
      id: string;
      label: string;
      key: keyof typeof projectSearchParams;
      value: any;
      type: "string" | "array";
    }[] = [];

    if (filters.search) {
      chips.push({
        id: "search",
        label: `Search: "${filters.search}"`,
        key: "search",
        value: null,
        type: "string",
      });
    }

    if (filters.status) {
      chips.push({
        id: "status",
        label: `Status: ${slugToTitle(filters.status)}`,
        key: "status",
        value: null,
        type: "string",
      });
    }

    if (filters.role) {
      chips.push({
        id: filters.role,
        label: `Role: ${slugToTitle(filters.role)}`,
        key: "role",
        value: null,
        type: "string",
      });
    }

    if (filters.tech_stack) {
      filters.tech_stack.forEach((val) => {
        chips.push({
          id: val,
          label: `Technology: ${slugToTitle(val)}`,
          key: "tech_stack",
          value: val,
          type: "array",
        });
      });
    }

    return chips;
  }, [filters]);

  const removeChip = useCallback(
    (chip: {
      key: keyof typeof filters;
      value: any;
      type: "string" | "array";
    }) => {
      if (chip.type === "array") {
        const currentValues = filters[chip.key] as string[];
        const next = currentValues.filter((v) => v !== chip.value);
        void setFilters(
          { [chip.key]: next.length > 0 ? next : null, page: 1 },
          persistentQueryStateOptions,
        );
      } else {
        void setFilters(
          { [chip.key]: null, page: 1 },
          persistentQueryStateOptions,
        );
      }
    },
    [filters, setFilters, persistentQueryStateOptions],
  );

  return {
    filters,
    setSort,
    setFilters,
    debouncedSetFilters,
    setPage,
    setPerPage,
    toggleFilter,
    setFilteredQuery,
    isPending,
    activeFiltersCount,
    activeChips,
    removeChip,
    resetFilters,
  };
};
