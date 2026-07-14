import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/listing-description",
    title: "Listing Description Generator",
    description: "Turn property specs into MLS-ready descriptions in the tone your buyers respond to.",
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
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
