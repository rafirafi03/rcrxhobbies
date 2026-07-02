"use client";

import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import FloatingActions from "./FloatingActions";
import CartDrawer from "./CartDrawer";
import { useSiteData } from "../../context/SiteDataContext";
import { CmsErrorBanner } from "../ui/ContentState";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { cmsError } = useSiteData();

  return (
    <>
      {cmsError ? <CmsErrorBanner message={cmsError} /> : null}
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <FloatingActions />
      <CartDrawer />
    </>
  );
}
