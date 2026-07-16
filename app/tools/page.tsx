import Link from "next/link";
import { HomeIcon, PhoneIcon, ChatIcon } from "@/components/icons";

const TOOLS = [
  {
    href: "/tools/listing-description",
    title: "Listing Description Generator",
    description: "Turn property specs into MLS-ready descriptions in the tone your buyers respond to.",
    Icon: HomeIcon,
  },
  {
    href: "/tools/outreach-script",
    title: "FSBO Outreach Script Generator",
    description: "Build a natural-sounding call, text, door-knock, or email script for a specific FSBO lead.",
    Icon: PhoneIcon,
  },
  {
    href: "/tools/objection-response",
    title: "Objection Response Assistant",
    description: "Turn a FSBO seller's objection into a natural, ready-to-say response, with coaching notes.",
    Icon: ChatIcon,
  },
];

export default function ToolsDashboardPage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus</p>
          <h1>Manfred SMART Board</h1>
          <p className="sub">AI-powered marketing tools built for Membership Plus subscribers.</p>
        </div>
      </header>

      <div className="tool-cards">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="tool-card" title={tool.description}>
            <span className="tool-card-icon">
              <tool.Icon width={36} height={36} />
            </span>
            <h2>{tool.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
