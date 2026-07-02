import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import Link from "next/link";

export function PageLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export function SectionLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
      <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden />
      {label}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-accent-light/20 px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-muted shadow-sm">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h3 className="luxury-heading text-lg text-foreground">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="luxury-btn-primary mt-6 inline-flex">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again in a moment.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/60 px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="luxury-heading text-lg text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="luxury-btn-outline mt-6">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function CmsErrorBanner({ message }: { message: string }) {
  return (
    <div className="border-b border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm text-red-800">
      {message}
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-white">
          <div className="aspect-square bg-border-subtle" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-2/3 rounded bg-border-subtle" />
            <div className="h-4 w-1/3 rounded bg-border-subtle" />
          </div>
        </div>
      ))}
    </div>
  );
}
