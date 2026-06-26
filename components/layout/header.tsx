"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  isAuthenticated: boolean;
}

function MobileNav({ isAuthenticated }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 md:hidden">
      <ThemeToggle />
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button aria-label="Open menu" size="icon" variant="ghost">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <SiteNav
            className="mt-6 flex-col items-stretch gap-1"
            isAuthenticated={isAuthenticated}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-2 font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
          >
            A
          </span>
          <span>AfriMet</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <SiteNav isAuthenticated={isAuthenticated} />
          <ThemeToggle />
        </div>

        <MobileNav isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}
