"use client";

import { useEffect } from "react";
import { ErrorState } from "../../components/ui/ContentState";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-container py-20">
      <ErrorState
        title="Couldn't load this page"
        description="Something went wrong while loading the store. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
