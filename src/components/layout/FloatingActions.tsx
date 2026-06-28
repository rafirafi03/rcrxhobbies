"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { getPhoneUrl, getWhatsAppChatUrl } from "@/lib/whatsapp";

export default function FloatingActions() {
  const pathname = usePathname();
  const hideOnProductPage = pathname.startsWith("/products/");

  if (hideOnProductPage) return null;

  return (
    <>
      <motion.a
        href={getWhatsAppChatUrl("Hello, I'm interested in your RC collection.")}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.35 }}
        whileTap={{ scale: 0.92 }}
        className="fixed right-4 z-[45] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 active:bg-[#20bd5a] sm:right-5 lg:right-6 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </motion.a>

      <motion.a
        href={getPhoneUrl()}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileTap={{ scale: 0.95 }}
        className="tap-target fixed right-4 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-lg active:text-accent sm:right-6 lg:flex lg:bottom-[calc(5.75rem+env(safe-area-inset-bottom))]"
        aria-label="Call us"
      >
        <Phone className="h-4 w-4" />
      </motion.a>
    </>
  );
}
