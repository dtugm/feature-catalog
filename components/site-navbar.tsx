"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@heroui/react";
import { ThemeSwitch } from "./theme-switch";

const FUTURISTIC_NAVBAR_CLASSES =
  "z-50 backdrop-blur-3xl backdrop-saturate-200 bg-background/50 border-b border-primary/20 shadow-lg shadow-primary/5";

const BRAND_TITLE_CLASSES =
  "font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400 hover:scale-[1.02] transition-transform duration-300";

const LOGO_ICON_CLASSES =
  "w-8 h-8 rounded-md bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transform rotate-45 hover:shadow-primary/70 hover:scale-110 transition-all duration-300";

export const SiteNavbar = () => {
  return (
    <Navbar
      maxWidth="xl"
      position="sticky"
      className={FUTURISTIC_NAVBAR_CLASSES}
      classNames={{
        wrapper: "px-4 sm:px-6 h-16",
      }}
    >
      {/* 1. LEFT Content: Logo and Title ("Geo AIT Gallery") */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2 p-0 m-0">
            {/* Logo Icon */}
            <div className={LOGO_ICON_CLASSES}>
              <span className="text-background font-black text-lg -rotate-45">
                G
              </span>
            </div>
            {/* Title Text (Interactive) */}
            <p className={BRAND_TITLE_CLASSES}>Geo AIT Gallery</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* 2. CENTER Content: Removed (Empty) */}

      {/* 3. RIGHT Content: Theme Toggle */}
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
