import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  href,
  linkText = "View All",
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="luxury-label text-xs sm:text-sm">{label}</p>
        <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
