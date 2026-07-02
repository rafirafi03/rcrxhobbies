"use client";

import { useSiteConfig } from "../../context/SiteDataContext";
import { getPhoneUrl } from "../../lib/whatsapp";

export default function AnnouncementBar() {
  const site = useSiteConfig();

  if (!site.phoneDisplay && !site.email) return null;

  return (
    <div className="border-b border-white/10 bg-foreground">
      <div className="page-container flex flex-wrap items-center justify-center gap-2 py-2 text-center text-xs sm:text-[0.8125rem]">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-white/85">
          <span className="font-semibold text-white">Need Assistance?</span>
          {site.phone ? (
            <a
              href={getPhoneUrl(site.phone)}
              className="font-medium text-accent-muted transition-colors hover:text-white"
            >
              {site.phoneDisplay}
            </a>
          ) : null}
          {site.phone && site.email ? <span className="hidden text-white/25 sm:inline">|</span> : null}
          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="hidden font-medium text-accent-muted transition-colors hover:text-white sm:inline"
            >
              {site.email}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
