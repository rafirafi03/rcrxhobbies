import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function HeroQuickActions() {
  return (
    <div className="bg-white pb-3 sm:pb-4">
      <div className="page-container">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <Link
            href="/shop"
            className="luxury-btn-primary min-h-[2.875rem] w-full justify-center !py-3 !text-xs sm:min-h-[3rem] sm:!text-sm"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={2.25} />
            Shop Now
          </Link>
          <Link
            href="/shop?sort=newest"
            className="luxury-btn-outline min-h-[2.875rem] w-full justify-center !border-accent !py-3 !text-xs !text-accent hover:!bg-accent hover:!text-white sm:min-h-[3rem] sm:!text-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2.25} />
            New Arrivals
          </Link>
        </div>
      </div>
    </div>
  );
}
