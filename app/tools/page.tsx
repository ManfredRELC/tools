import Link from "next/link";
import {
  HomeIcon,
  PhoneIcon,
  ChatIcon,
  ClipboardCheckIcon,
  WandIcon,
  ChecklistIcon,
  GlobeIcon,
  StarIcon,
  HandshakeIcon,
  MegaphoneIcon,
  GraduationCapIcon,
} from "@/components/icons";
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
      {
        href: "/tools/ce-tracker-realestate",
        title: "CE Tracker",
        description: "Track continuing-education hours toward New York's 22.5-hour renewal requirement, including topic minimums and your renewal deadline.",
        Icon: GraduationCapIcon,
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
      {
        href: "/tools/report-assistant",
        title: "AI Report Assistant",
        description: "Turn rough field notes into a compliant, report-ready narrative, checked against NY's Standards of Practice as it writes.",
        Icon: WandIcon,
      },
      {
        href: "/tools/business-builder-checklist",
        title: "Business Builder Checklist",
        description: "The part school doesn't teach: setting up and running the business side of home inspection.",
        Icon: ChecklistIcon,
      },
      {
        href: "/tools/gbp-checklist",
        title: "Google Business Profile Checklist",
        description: "Set up, optimize, and maintain the single highest-return marketing asset for a local inspection business.",
        Icon: GlobeIcon,
      },
      {
        href: "/tools/review-templates",
        title: "Review Generation Templates",
        description: "Ready-to-send templates for asking for reviews and responding to whatever comes back — good, mixed, or difficult.",
        Icon: StarIcon,
      },
      {
        href: "/tools/agent-broker-kit",
        title: "Agent & Broker Relationship Kit",
        description: "A bio generator plus ready-to-use templates for building the referral relationships that keep a book of business full.",
        Icon: HandshakeIcon,
      },
      {
        href: "/tools/social-posts",
        title: "Social Media Post Generator",
        description: "Turn one topic prompt into a full week of ready-to-post content across platforms.",
        Icon: MegaphoneIcon,
      },
      {
        href: "/tools/ce-tracker-home-inspector",
        title: "CE Tracker",
        description: "Track continuing-education hours toward New York's 24-hour renewal requirement and watch your renewal deadline.",
        Icon: GraduationCapIcon,
      },
    ],
  },
  {
    id: "appraiser",
    label: "Real Estate Appraiser",
    tools: [
      {
        href: "/tools/ce-tracker-appraiser",
        title: "CE Tracker",
        description: "Track continuing-education hours toward New York's 28-hour renewal requirement, including USPAP and Valuation Bias & Fair Housing.",
        Icon: GraduationCapIcon,
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
