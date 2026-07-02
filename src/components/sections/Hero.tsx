import HeroBanner from "./HeroBanner";
import HeroQuickActions from "./HeroQuickActions";
import TrustMarquee from "./TrustMarquee";
import type { HeroBanner as HeroBannerType } from "../../types";

export default function Hero({ banners }: { banners: HeroBannerType[] }) {
  return (
    <>
      <HeroBanner banners={banners} />
      <HeroQuickActions />
      <TrustMarquee />
    </>
  );
}
