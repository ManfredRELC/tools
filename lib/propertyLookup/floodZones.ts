import { FloodRiskLevel, FloodZoneResult } from "./types";

interface FloodZoneInfo {
  riskLevel: FloodRiskLevel;
  label: string;
  description: string;
}

// Reference: FEMA National Flood Hazard Layer zone designations.
const FLOOD_ZONE_INFO: Record<string, FloodZoneInfo> = {
  A: {
    riskLevel: "high",
    label: "High Risk",
    description: "Special Flood Hazard Area (1% annual chance flood); no base flood elevations determined.",
  },
  AE: {
    riskLevel: "high",
    label: "High Risk",
    description: "Special Flood Hazard Area (1% annual chance flood); base flood elevations determined.",
  },
  AH: {
    riskLevel: "high",
    label: "High Risk",
    description: "Special Flood Hazard Area with shallow flooding (ponding), typically 1-3 feet.",
  },
  AO: {
    riskLevel: "high",
    label: "High Risk",
    description: "Special Flood Hazard Area with shallow flooding (sheet flow), typically 1-3 feet.",
  },
  AR: {
    riskLevel: "high",
    label: "High Risk",
    description: "Special Flood Hazard Area resulting from decertification of a previously accredited flood control system.",
  },
  A99: {
    riskLevel: "high",
    label: "High Risk",
    description: "Special Flood Hazard Area to be protected by a flood control system under construction.",
  },
  V: {
    riskLevel: "high",
    label: "High Risk — Coastal",
    description: "Coastal high-hazard area subject to wave action; no base flood elevations determined.",
  },
  VE: {
    riskLevel: "high",
    label: "High Risk — Coastal",
    description: "Coastal high-hazard area subject to wave action; base flood elevations determined.",
  },
  X: {
    riskLevel: "minimal",
    label: "Minimal Risk",
    description: "Outside the Special Flood Hazard Area — minimal flood risk under FEMA's current mapping.",
  },
  D: {
    riskLevel: "undetermined",
    label: "Undetermined Risk",
    description: "Flood hazard has not been determined for this area.",
  },
};

export function describeFloodZone(zone: string | null, subtype: string | null): Omit<FloodZoneResult, "zone" | "subtype" | "isSFHA"> {
  if (!zone) {
    return {
      riskLevel: "undetermined",
      label: "No Data Returned",
      description:
        "FEMA's National Flood Hazard Layer did not return a zone for this location. This can mean the area is unmapped, or the service is temporarily unavailable -- verify directly on FEMA's Flood Map Service Center.",
      unavailable: true,
    };
  }

  const normalized = zone.toUpperCase();

  if (normalized === "X" && subtype && /0\.2\s*PCT/i.test(subtype)) {
    return {
      riskLevel: "moderate",
      label: "Moderate Risk",
      description:
        'The 0.2% annual chance flood hazard area (the "500-year" floodplain) -- outside the Special Flood Hazard Area, but worth flagging.',
    };
  }

  const info = FLOOD_ZONE_INFO[normalized];
  if (info) return info;

  return {
    riskLevel: "undetermined",
    label: "Unrecognized Zone",
    description: `FEMA returned zone code "${zone}", which isn't in our reference table -- verify directly on FEMA's Flood Map Service Center.`,
  };
}
