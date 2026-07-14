"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/tools", label: "Dashboard" },
  { href: "/tools/listing-description", label: "Listing Description Generator" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="site-header">
      <Link href="/tools" className="site-brand">
        <span className="pin" />
        Manfred RELC · Agent Tools
      </Link>
      <nav className="site-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <button className="logout-btn" onClick={handleLogout} type="button">
          Log out
        </button>
      </nav>
    </header>
  );
}
