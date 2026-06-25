"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ShoppingBag, Heart, MessageCircle, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { getPhoneUrl, getWhatsAppChatUrl } from "@/lib/whatsapp";
import { useStore } from "@/context/StoreContext";
import SearchOverlay from "@/components/layout/SearchOverlay";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, wishlistCount, setCartOpen, searchOpen, setSearchOpen } = useStore();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
        <div className="page-container flex items-center justify-between gap-3 py-3">
          {/* Logo — icon only on mobile */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={SITE_CONFIG.name}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <span className="text-xs font-bold text-white">RC</span>
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="font-display truncate text-lg font-bold text-foreground">{SITE_CONFIG.name}</p>
              <p className="text-[0.625rem] font-medium tracking-wide text-muted uppercase">
                India&apos;s RC Destination
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(pathname, link.href)
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="tap-target flex items-center justify-center rounded-lg p-2 text-muted active:bg-accent-light active:text-accent"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/wishlist"
              className="tap-target relative flex items-center justify-center rounded-lg p-2 text-muted active:bg-accent-light active:text-accent"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.625rem] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="tap-target relative flex items-center justify-center rounded-lg p-2 text-muted active:bg-accent-light active:text-accent"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.625rem] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* WhatsApp — desktop header only (hidden below lg) */}
            <Link
              href={getWhatsAppChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-btn-primary ml-2 !hidden !px-4 !py-2 !text-sm lg:!inline-flex"
            >
              WhatsApp
            </Link>

            {/* Hamburger — mobile & tablet only */}
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="tap-target ml-0.5 flex items-center justify-center rounded-lg p-2 text-foreground active:bg-accent-light lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
              onClick={closeMenu}
              aria-label="Close menu"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 z-[56] flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl lg:hidden"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-bold text-foreground">Menu</p>
                <button
                  onClick={closeMenu}
                  className="tap-target flex items-center justify-center rounded-lg p-2 text-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex min-h-[3rem] items-center border-b border-border text-base font-medium ${
                      isActive(pathname, link.href) ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      closeMenu();
                      setCartOpen(true);
                    }}
                    className="flex min-h-[3rem] w-full items-center justify-between text-base font-medium text-foreground"
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <Link
                    href="/wishlist"
                    onClick={closeMenu}
                    className="flex min-h-[3rem] items-center justify-between text-base font-medium text-foreground"
                  >
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>

              <div className="space-y-3 border-t border-border p-4">
                <a
                  href={getPhoneUrl()}
                  className="flex min-h-[2.75rem] items-center gap-3 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  {SITE_CONFIG.phoneDisplay}
                </a>
                <Link
                  href={getWhatsAppChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="luxury-btn-primary flex min-h-[2.75rem] w-full items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
