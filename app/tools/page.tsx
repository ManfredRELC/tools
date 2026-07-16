import Link from "next/link";
import { HomeIcon, PhoneIcon, ChatIcon, ClipboardCheckIcon } from "@/components/icons";
import { PanelLabel } from "@/components/PanelLabel";

const TOOL_CATEGORIES = [
  {
    id: "salesperson",
    label: "Real Estate Salesperson / Broker",
    tools: [
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
    ],
  },
  {
    id: "home-inspector",
    label: "Home Inspector",
    tools: [
      {
        href: "/tools/inspection-comments",
        title: "Inspection Report Comment Library",
        description: "Search NY Standards of Practice-based report comments and build a report draft to copy in.",
        Icon: ClipboardCheckIcon,
      },
    ],
  },
];

export default function ToolsDashboardPage() {
  return (
    <div className="wrap">
      <header>
        <div>
          <p className="brand-eyebrow">Manfred Real Estate Learning Center — Membership Plus</p>
          <h1>Manfred SMART Board</h1>
          <p className="sub">AI-powered tools built for Membership Plus subscribers.</p>
        </div>
      </header>

      {TOOL_CATEGORIES.map((category) => (
        <div key={category.id} style={{ marginBottom: 32 }}>
          <PanelLabel>{category.label}</PanelLabel>
          <div className="tool-cards">
            {category.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="tool-card" title={tool.description}>
                <span className="tool-card-icon">
                  <tool.Icon width={36} height={36} />
                </span>
                <h2>{tool.title}</h2>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
