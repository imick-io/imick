"use client";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import avatar from "@/assets/avatar.webp";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = { name: string; href: string };

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Learn", href: "/learn" },
  { name: "Newsletter", href: "/newsletter" },
];

const contactItem: NavItem = { name: "Contact", href: "/contact" };

export default function SimpleNavbarWithHoverEffects() {
  return (
    <div className="sticky inset-x-0 top-4 z-50 w-full px-4">
      <Navbar />
    </div>
  );
}

const Navbar = () => {
  return (
    <div className="w-full">
      <DesktopNav items={navItems} />
      <MobileNav items={navItems} />
    </div>
  );
};

type NavProps = { items: NavItem[] };

const DesktopNav = ({ items }: NavProps) => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-5xl flex-row items-center justify-between rounded-full border border-border bg-background/80 px-4 py-2 backdrop-blur-md lg:flex",
      )}
    >
      <Logo />
      <div className="flex flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium">
        {items.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHovered(idx)}
              className={cn(
                "relative px-4 py-2 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {hovered === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 h-full w-full rounded-full bg-muted"
                />
              )}
              <span className="relative z-20">{item.name}</span>
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={contactItem.href}
          className={cn(
            "hidden items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted md:inline-flex",
            pathname === contactItem.href
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {contactItem.name}
        </Link>
        <ThemeToggle />
      </div>
    </motion.div>
  );
};

const MobileNav = ({ items }: NavProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      animate={{ borderRadius: open ? "16px" : "9999px" }}
      key={String(open)}
      className="relative mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between border border-border bg-background/80 px-4 py-2 backdrop-blur-md lg:hidden"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="text-foreground"
          >
            {open ? <IconX /> : <IconMenu2 />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-16 z-20 flex w-full flex-col items-start justify-start gap-4 rounded-2xl border border-border bg-background px-4 py-6 shadow-lg"
          >
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block w-full text-base font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href={contactItem.href}
              onClick={() => setOpen(false)}
              className={cn(
                "inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-base font-medium transition-colors hover:bg-muted",
                pathname === contactItem.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {contactItem.name}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.handle} home`}
      className="relative z-20 mr-4 flex items-center gap-2 px-2 py-1"
    >
      <Image
        src={avatar}
        alt={siteConfig.name}
        width={32}
        height={32}
        priority
        className="size-8 rounded-full"
      />
      <span className="font-medium text-foreground">{siteConfig.handle}</span>
    </Link>
  );
};
