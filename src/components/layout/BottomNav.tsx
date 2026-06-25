"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Search, Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";

function isShopActive(pathname: string) {
  return (
    pathname === "/shop" ||
    pathname.startsWith("/shop/") ||
    pathname.startsWith("/category/") ||
    pathname.startsWith("/products/")
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, setCartOpen, setSearchOpen } = useStore();

  const items = [
    {
      type: "link" as const,
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      type: "link" as const,
      href: "/shop",
      label: "Shop",
      icon: Store,
      active: isShopActive(pathname),
    },
    {
      type: "button" as const,
      label: "Search",
      icon: Search,
      active: false,
      onClick: () => setSearchOpen(true),
    },
    {
      type: "link" as const,
      href: "/wishlist",
      label: "Wishlist",
      icon: Heart,
      active: pathname === "/wishlist",
      badge: wishlistCount,
    },
    {
      type: "button" as const,
      label: "Cart",
      icon: ShoppingBag,
      active: pathname === "/cart",
      badge: cartCount,
      onClick: () => setCartOpen(true),
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <span className="relative flex h-6 w-6 items-center justify-center">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    item.active ? "text-accent" : "text-muted"
                  }`}
                  strokeWidth={item.active ? 2.25 : 2}
                />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.5625rem] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              <span
                className={`mt-0.5 text-[0.625rem] font-medium leading-none ${
                  item.active ? "text-accent" : "text-muted"
                }`}
              >
                {item.label}
              </span>
              {item.active && (
                <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </>
          );

          const className =
            "relative flex flex-1 flex-col items-center justify-center gap-0.5 active:opacity-70";

          if (item.type === "link") {
            return (
              <Link key={item.label} href={item.href} className={className} aria-current={item.active ? "page" : undefined}>
                {content}
              </Link>
            );
          }

          return (
            <button key={item.label} type="button" onClick={item.onClick} className={className}>
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
