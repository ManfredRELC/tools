import Link from "next/link";
import { HomeIcon } from "@/components/icons";

const TOOLS = [
  {
    href: "/tools/listing-description",
    title: "Listing Description Generator",
    description: "Turn property specs into MLS-ready descriptions in the tone your buyers respond to.",
    Icon: HomeIcon,
  },
];

export default function ToolsDashboardPage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus</p>
          <h1>Agent Tools</h1>
          <p className="sub">AI-powered marketing tools built for Membership Plus subscribers.</p>
        </div>
      </header>

      <div className="tool-cards">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="tool-card">
            <span className="tool-card-icon">
              <tool.Icon />
            </span>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
