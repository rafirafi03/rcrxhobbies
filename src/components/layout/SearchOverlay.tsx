"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { searchProducts, getProductPath } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AppImage from "@/components/ui/AppImage";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = query.trim() ? searchProducts(query).slice(0, 6) : [];

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto max-w-2xl px-6 pt-24"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 border-b border-white/20 pb-4">
              <Search className="h-5 w-5 text-white/60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search RC cars, parts, categories..."
                className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/40"
              />
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {results.length > 0 && (
              <ul className="mt-4 divide-y divide-white/10 bg-white/5 backdrop-blur-md">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={getProductPath(product.id)}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-white/10"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden">
                        <AppImage
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-white/50">{product.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">{formatPrice(product.price)}</span>
                        <ArrowRight className="h-4 w-4 text-white/40" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {query.trim() && results.length === 0 && (
              <p className="mt-6 text-center text-sm text-white/50">No products found</p>
            )}

            {query.trim() && results.length > 0 && (
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="mt-4 block text-center text-sm tracking-wide text-white/70 hover:text-white"
              >
                View all results for &ldquo;{query}&rdquo;
              </Link>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
