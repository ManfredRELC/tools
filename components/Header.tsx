"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/tools", label: "Dashboard" },
  { href: "/tools/listing-description", label: "Listing Description Generator" },
  { href: "/tools/outreach-script", label: "FSBO & Expired Listing Outreach Script Generator" },
  { href: "/tools/objection-response", label: "FSBO & Expired Listing Objection Response Assistant" },
  { href: "/tools/ce-tracker-realestate", label: "CE Tracker (Real Estate)" },
  { href: "/tools/inspection-comments", label: "Inspection Report Comment Library" },
  { href: "/tools/report-assistant", label: "AI Report Assistant" },
  { href: "/tools/business-builder-checklist", label: "Business Builder Checklist" },
  { href: "/tools/gbp-checklist", label: "Google Business Profile Checklist" },
  { href: "/tools/review-templates", label: "Review Generation Templates" },
  { href: "/tools/agent-broker-kit", label: "Agent & Broker Relationship Kit" },
  { href: "/tools/social-posts", label: "Social Media Post Generator" },
  { href: "/tools/ce-tracker-home-inspector", label: "CE Tracker (Home Inspector)" },
  { href: "/tools/ce-tracker-appraiser", label: "CE Tracker (Appraiser)" },
  { href: "/tools/property-lookup", label: "Property Lookup" },
  { href: "/tools/fee-calculator", label: "Fee Calculator" },
  { href: "/tools/parcel-search", label: "Parcel Search" },
  { href: "/tools/mileage-expense-tracker", label: "Mileage & Expense Tracker" },
  { href: "/tools/open-house-kit", label: "Open House Kit" },
  { href: "/tools/seller-net-sheet", label: "Seller Net Sheet Calculator" },
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
        Manfred RELC · Manfred SMART Board
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
