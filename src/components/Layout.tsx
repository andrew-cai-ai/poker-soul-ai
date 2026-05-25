import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

interface LayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
}

export function Layout({ children, showBack = false }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-8 pt-6">
      <header className="mb-6 flex items-center justify-between">
        {showBack ? (
          <Link
            href="/"
            className="font-display text-xs tracking-widest text-casino-gold/70 transition-colors hover:text-casino-gold"
          >
            ← 返回
          </Link>
        ) : (
          <div />
        )}
        <Link href="/" className="text-center">
          <span className="font-display text-lg font-bold tracking-wide text-casino-gold">
            ♠ Poker Soul AI
          </span>
        </Link>
        <div className="w-16" />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
