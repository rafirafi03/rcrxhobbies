"use client";

import { formatPrice } from "../../lib/format";
import type { OrderSummary } from "../../types";
import { useSiteConfig } from "../../context/SiteDataContext";
import { Card, CardBody } from "../ui/Card";

interface OrderSummaryCardProps {
  summary: OrderSummary;
  showShippingNote?: boolean;
}

export default function OrderSummaryCard({
  summary,
  showShippingNote = true,
}: OrderSummaryCardProps) {
  const site = useSiteConfig();

  return (
    <Card accentTop={false}>
      <CardBody>
        <h3 className="luxury-heading mb-6 text-xl">Order Summary</h3>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal ({summary.itemCount} items)</dt>
          <dd>{formatPrice(summary.subtotal)}</dd>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-accent">
            <dt>Discount ({summary.promoApplied})</dt>
            <dd>-{formatPrice(summary.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-base font-medium">
          <dt>Total</dt>
          <dd>{formatPrice(summary.total)}</dd>
        </div>
      </dl>
      {showShippingNote && summary.shipping > 0 && (
        <p className="mt-4 text-xs text-muted">
          Add {formatPrice(site.freeShippingThreshold - (summary.subtotal - summary.discount))} more for free shipping
        </p>
      )}
      </CardBody>
    </Card>
  );
}
