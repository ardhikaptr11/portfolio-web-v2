import type { Metadata } from "next";
import { ReactNode } from "react";
import FloatingBackToTopButton from "../../components/floating-back-top-button";
import Footer from "../../components/footer";
import LanguageSwitcher from "../../components/language-switcher";
import Navbar from "../../components/navbar";
import ScreenLoader from "../../components/screen-loader";
import { NAV_ITEMS } from "../../constants/items.constants";
import { getAllData } from "../../lib/queries/home";
import "../../globals.css";

export const revalidate = 86400;

const NAV_ITEMS_SLICED = NAV_ITEMS.slice(1);
NAV_ITEMS_SLICED.splice(3, 1);

const LandingPageLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const { profile } = await getAllData();
  const { tagline, tagline_id } = profile;

  return (
    <ScreenLoader taglines={{ tagline, tagline_id }}>
      <Navbar items={NAV_ITEMS_SLICED} socials={profile.social_links} />
      {children}
      <Footer items={NAV_ITEMS} profile={profile} />
      <FloatingBackToTopButton />
      <LanguageSwitcher />
    </ScreenLoader>
  );
};

export default LandingPageLayout;
