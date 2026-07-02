"use client";

import { createContext, useContext, useMemo } from "react";
import type { Category, Product, SiteSettings } from "../types";
import { DEFAULT_SITE_SETTINGS } from "../lib/catalog";
import { getSiteConfig } from "../lib/constants";

interface SiteDataContextValue {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  siteConfig: ReturnType<typeof getSiteConfig>;
  cmsError: string | null;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({
  products,
  categories,
  settings,
  cmsError,
  children,
}: {
  products: Product[];
  categories: Category[];
  settings: SiteSettings | null;
  cmsError?: string | null;
  children: React.ReactNode;
}) {
  const resolvedSettings = settings ?? DEFAULT_SITE_SETTINGS;

  const value = useMemo(
    () => ({
      products,
      categories,
      settings: resolvedSettings,
      siteConfig: getSiteConfig(resolvedSettings),
      cmsError: cmsError ?? null,
    }),
    [products, categories, resolvedSettings, cmsError]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
}

export function useSiteConfig() {
  return useSiteData().siteConfig;
}
