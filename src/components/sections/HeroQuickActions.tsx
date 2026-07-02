import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export default function HeroQuickActions() {
  return (
    <div className="hero-actions pt-3 sm:pt-4">
      <div className="page-container">
        <div className="hero-actions__grid">
          <Link href="/shop" className="hero-action-btn hero-action-btn--shop">
            <ShoppingBag className="hero-action-btn__icon h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.25} />
            <span>Shop Now</span>
            <ArrowRight className="hero-action-btn__icon hidden h-3.5 w-3.5 opacity-90 sm:block" strokeWidth={2.5} />
          </Link>
          <Link href="/shop?sort=newest" className="hero-action-btn hero-action-btn--new">
            <Sparkles className="hero-action-btn__icon h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.25} />
            <span>New Arrivals</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
