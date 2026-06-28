import { SITE_CONFIG } from "@/lib/constants";
import { getPhoneUrl } from "@/lib/whatsapp";

export default function AnnouncementBar() {
  return (
    <div className="border-b border-accent-muted bg-accent-light">
      <div className="page-container flex flex-wrap items-center justify-center gap-2 py-2 text-center text-xs text-accent-dark sm:text-[0.8125rem]">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="font-semibold">Need Assistance?</span>
          <a href={getPhoneUrl()} className="font-medium hover:underline">
            {SITE_CONFIG.phoneDisplay}
          </a>
          <span className="hidden text-muted sm:inline">|</span>
          <a href={`mailto:${SITE_CONFIG.email}`} className="hidden font-medium hover:underline sm:inline">
            {SITE_CONFIG.email}
          </a>
        </div>
      </div>
    </div>
  );
}
