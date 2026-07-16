export type CommentType = "info" | "maint" | "repair" | "safety" | "limit";

export interface InspectionComment {
  system: string;
  cite: string;
  type: CommentType;
  text: string;
}

export const TYPE_LABELS: Record<CommentType, string> = {
  info: "Informational",
  maint: "Maintenance",
  repair: "Repair recommended",
  safety: "Unsafe / specialist referral",
  limit: "Limitation / exclusion (SOP)",
};

export const TYPE_FILTERS: { key: CommentType | "all"; label: string }[] = [
  { key: "all", label: "All types" },
  { key: "info", label: "Informational" },
  { key: "maint", label: "Maintenance" },
  { key: "repair", label: "Repair recommended" },
  { key: "safety", label: "Unsafe / specialist referral" },
  { key: "limit", label: "Limitation / exclusion (SOP)" },
];

export interface RequiredClause {
  label: string;
  text: string;
}

export const REQUIRED_CLAUSES: RequiredClause[] = [
  {
    label: "Clause 1 — Scope & Licensure",
    text: "Home inspectors are licensed by the NYS Department of State. Home Inspectors may only report on readily accessible and observed conditions as outlined in this pre-inspection agreement, Article 12 B of the Real Property Law and the regulations promulgated thereunder including, but not limited to, the Code of Ethics and Regulations and the Standards of Practice as provided in Title 19 NYCRR Subparts 197-4 and 197-5 et seq. Home inspectors are not permitted to provide engineering or architectural services.",
  },
  {
    label: "Clause 2 — Consent to Disclose Immediate Health/Safety Threats",
    text: "If immediate threats to health or safety are observed during the course of the inspection, the client hereby consents to allow the home inspector to disclose such immediate threats to health or safety to the property owner and/or occupants of the property.",
  },
];

export const INSPECTION_COMMENTS: InspectionComment[] = [
  // SITE CONDITIONS — §197-5.4
  {
    system: "Site Conditions",
    cite: "§197-5.4",
    type: "info",
    text: "The building perimeter grade and water drainage directly adjacent to the foundation were observed and appear to direct surface water away from the structure at the time of inspection.",
  },
  {
    system: "Site Conditions",
    cite: "§197-5.4",
    type: "repair",
    text: "Grade adjacent to the foundation was observed sloping toward the structure in one or more areas. Recommend further evaluation and correction to help direct surface water away from the foundation.",
  },
  {
    system: "Site Conditions",
    cite: "§197-5.4",
    type: "maint",
    text: "Trees and/or vegetation observed in close proximity to the residential building may be adversely affecting the structure. Recommend monitoring or trimming as appropriate.",
  },
  {
    system: "Site Conditions",
    cite: "§197-5.4",
    type: "repair",
    text: "Walkways, steps, driveway, patio, and/or retaining wall surfaces were observed with cracking, heaving, or settlement. Recommend further evaluation by a qualified contractor.",
  },
  {
    system: "Site Conditions",
    cite: "§197-5.4",
    type: "limit",
    text: "Fences, privacy walls, and the health or condition of trees, shrubs, and other vegetation are outside the scope of this inspection per New York State Standards of Practice.",
  },

  // STRUCTURAL SYSTEMS — §197-5.5
  {
    system: "Structural Systems",
    cite: "§197-5.5",
    type: "info",
    text: "The visible foundation, floor structure, wall structure, ceiling structure, and roof structure were observed and appeared generally consistent with typical residential construction for the age of the building.",
  },
  {
    system: "Structural Systems",
    cite: "§197-5.5",
    type: "repair",
    text: "Deterioration and/or damage was observed at [foundation / floor framing / wall framing / roof framing]. Recommend further evaluation by a qualified professional, such as a structural engineer.",
  },
  {
    system: "Structural Systems",
    cite: "§197-5.5",
    type: "safety",
    text: "The condition observed at [location] is, in the home inspector's professional opinion, unsafe and presents a significant risk of injury during normal use. Recommend further evaluation and correction by a qualified professional prior to occupancy.",
  },
  {
    system: "Structural Systems",
    cite: "§197-5.5",
    type: "limit",
    text: "Structural components concealed by finishes, insulation, or stored items were not observed. New York State Standards of Practice do not require inspectors to move personal property or dismantle finished surfaces.",
  },

  // EXTERIOR — §197-5.6
  {
    system: "Exterior",
    cite: "§197-5.6",
    type: "info",
    text: "Exterior wall coverings, flashing, and trim were observed and appear generally serviceable at the time of inspection.",
  },
  {
    system: "Exterior",
    cite: "§197-5.6",
    type: "maint",
    text: "Sealant/caulking at trim, siding joints, and/or penetrations shows signs of wear. Recommend routine maintenance.",
  },
  {
    system: "Exterior",
    cite: "§197-5.6",
    type: "repair",
    text: "Deficiencies were observed at one or more attached decks, balconies, stoops, steps, porches, or railings. Recommend further evaluation and correction by a qualified contractor.",
  },
  {
    system: "Exterior",
    cite: "§197-5.6",
    type: "repair",
    text: "A representative number of windows inspected showed deficiencies (e.g., inoperable, damaged, or deteriorated) at time of inspection. Recommend further evaluation by a qualified contractor.",
  },
  {
    system: "Exterior",
    cite: "§197-5.6",
    type: "limit",
    text: "Screening, shutters, awnings, seasonal accessories, fences, recreational facilities, and the operation of security locks/devices are outside the scope of this inspection per New York State Standards of Practice.",
  },
  {
    system: "Exterior",
    cite: "§197-5.6",
    type: "limit",
    text: "The presence of safety glazing and the integrity of thermal window seals are outside the scope of this inspection per New York State Standards of Practice.",
  },

  // ROOF SYSTEMS — §197-5.7
  {
    system: "Roof Systems",
    cite: "§197-5.7",
    type: "info",
    text: "Roofing materials, roof drainage systems, flashing, and roof penetrations were observed by [ground level / ladder at the eaves / walking the roof] and appeared generally serviceable at time of inspection.",
  },
  {
    system: "Roof Systems",
    cite: "§197-5.7",
    type: "maint",
    text: "Debris was observed accumulated in gutters, downspouts, and/or valleys. Recommend cleaning to maintain proper roof drainage.",
  },
  {
    system: "Roof Systems",
    cite: "§197-5.7",
    type: "repair",
    text: "Deficiencies were observed at roof flashing, penetrations, skylights, or chimney flashing. Recommend further evaluation and repair by a qualified roofing contractor.",
  },
  {
    system: "Roof Systems",
    cite: "§197-5.7",
    type: "safety",
    text: "Signs of past or active water intrusion were observed at [location]. Recommend further evaluation by a qualified roofing contractor to determine the source and any necessary repairs.",
  },
  {
    system: "Roof Systems",
    cite: "§197-5.7",
    type: "limit",
    text: "This inspection does not determine remaining life expectancy, manufacturer defects, installation methods, recalls, or the number of roofing layers present, per New York State Standards of Practice.",
  },
  {
    system: "Roof Systems",
    cite: "§197-5.7",
    type: "limit",
    text: "The roof was not walked/accessed because doing so could, in the home inspector's judgment, damage the roofing material or risk the inspector's safety, per New York State Standards of Practice. The roof was observed by [method].",
  },

  // PLUMBING SYSTEM — §197-5.8
  {
    system: "Plumbing System",
    cite: "§197-5.8",
    type: "info",
    text: "Interior water supply and distribution, drain/waste/vent systems, and water heating equipment were observed and operated using normal controls, and appeared generally functional at time of inspection.",
  },
  {
    system: "Plumbing System",
    cite: "§197-5.8",
    type: "repair",
    text: "Functional flow and/or functional drainage was not achieved at one or more fixtures tested. Recommend further evaluation by a licensed plumber.",
  },
  {
    system: "Plumbing System",
    cite: "§197-5.8",
    type: "repair",
    text: "An active leak was observed at [fixture/location] at time of inspection. Recommend further evaluation and repair by a licensed plumber.",
  },
  {
    system: "Plumbing System",
    cite: "§197-5.8",
    type: "safety",
    text: "The water heater temperature/pressure relief valve discharge pipe is not properly routed or terminated, which is, in the home inspector's professional opinion, unsafe. Recommend further evaluation and correction by a licensed plumber.",
  },
  {
    system: "Plumbing System",
    cite: "§197-5.8",
    type: "limit",
    text: "Water potability, water conditioning equipment, private water supply systems (wells), on-site sewage disposal systems (septic, cesspools, drain fields), and gas supply piping/leakage are outside the scope of this inspection per New York State Standards of Practice.",
  },
  {
    system: "Plumbing System",
    cite: "§197-5.8",
    type: "limit",
    text: "This inspection does not include operating main, branch, or fixture shutoff valves (other than faucets), or determining water temperature, per New York State Standards of Practice.",
  },

  // ELECTRICAL SYSTEM — §197-5.9
  {
    system: "Electrical System",
    cite: "§197-5.9",
    type: "info",
    text: "The service drop, service entrance conductors, main and branch circuit conductors (visible after panel cover removal), service grounding, and a representative number of lighting fixtures, switches, receptacles, and GFCI devices were observed and appeared generally consistent with normal residential wiring practices.",
  },
  {
    system: "Electrical System",
    cite: "§197-5.9",
    type: "repair",
    text: "One or more tested receptacles were not properly grounded or wired (open ground, reverse polarity). Recommend further evaluation and correction by a licensed electrician.",
  },
  {
    system: "Electrical System",
    cite: "§197-5.9",
    type: "repair",
    text: "GFCI protection was not present or did not trip when tested in one or more required locations. Recommend further evaluation and installation/repair by a licensed electrician.",
  },
  {
    system: "Electrical System",
    cite: "§197-5.9",
    type: "safety",
    text: "Conditions observed in the electrical panel (e.g., double-tapped breakers, improper connections, exposed conductors) are, in the home inspector's professional opinion, unsafe. Recommend immediate further evaluation by a licensed electrician.",
  },
  {
    system: "Electrical System",
    cite: "§197-5.9",
    type: "safety",
    text: "Aluminum branch circuit wiring was observed. Recommend further evaluation by a licensed electrician regarding connection methods.",
  },
  {
    system: "Electrical System",
    cite: "§197-5.9",
    type: "limit",
    text: "This inspection does not include testing every switch, receptacle, and fixture; removing cover plates; measuring amperage, voltage, or impedance; or evaluating low-voltage, alarm, intercom, or standby generator systems, per New York State Standards of Practice.",
  },

  // HEATING SYSTEM — §197-5.10
  {
    system: "Heating System",
    cite: "§197-5.10",
    type: "info",
    text: "The heating system was operated using normal thermostat controls and responded as expected at time of inspection. Fuel type and distribution method were noted.",
  },
  {
    system: "Heating System",
    cite: "§197-5.10",
    type: "maint",
    text: "Filter(s) observed dirty or overdue for replacement. Recommend routine replacement per manufacturer guidance.",
  },
  {
    system: "Heating System",
    cite: "§197-5.10",
    type: "repair",
    text: "A representative number of heat sources in one or more habitable spaces did not respond as expected to normal controls. Recommend further evaluation by a licensed HVAC contractor.",
  },
  {
    system: "Heating System",
    cite: "§197-5.10",
    type: "safety",
    text: "Visible flue pipes, dampers, or vent components showed signs of deterioration, corrosion, or improper connection. Recommend further evaluation by a licensed HVAC contractor prior to further use.",
  },
  {
    system: "Heating System",
    cite: "§197-5.10",
    type: "limit",
    text: "This inspection does not include evaluation of heat exchangers, testing for gas leaks or carbon monoxide, determining clearance to combustibles, or evaluating system capacity, adequacy, or efficiency, per New York State Standards of Practice.",
  },

  // AIR CONDITIONING SYSTEMS — §197-5.11
  {
    system: "Air Conditioning Systems",
    cite: "§197-5.11",
    type: "info",
    text: "The air conditioning system was operated using the thermostat and responded as expected at time of inspection.",
  },
  {
    system: "Air Conditioning Systems",
    cite: "§197-5.11",
    type: "repair",
    text: "System did not respond as expected to normal thermostat controls at time of inspection. Recommend further evaluation by a licensed HVAC contractor.",
  },
  {
    system: "Air Conditioning Systems",
    cite: "§197-5.11",
    type: "limit",
    text: "This inspection does not include checking refrigerant pressure or determining the presence of leakage, evaluating capacity/efficiency/adequacy, or operating the system when exterior temperature is below 65°F, per New York State Standards of Practice.",
  },
  {
    system: "Air Conditioning Systems",
    cite: "§197-5.11",
    type: "limit",
    text: "Wall- or window-mounted air conditioning units and evaporative coolers are outside the scope of this inspection per New York State Standards of Practice.",
  },

  // INTERIOR — §197-5.12
  {
    system: "Interior",
    cite: "§197-5.12",
    type: "info",
    text: "Walls, ceilings, and floors were observed and appear generally consistent with typical wear for the age of the residential building.",
  },
  {
    system: "Interior",
    cite: "§197-5.12",
    type: "repair",
    text: "One or more primary windows and/or interior doors tested did not operate as intended. Recommend further evaluation and repair.",
  },
  {
    system: "Interior",
    cite: "§197-5.12",
    type: "repair",
    text: "The garage door, garage door safety devices, and/or garage door operator did not function properly when tested. Recommend further evaluation and repair by a qualified technician.",
  },
  {
    system: "Interior",
    cite: "§197-5.12",
    type: "safety",
    text: "Signs of water penetration were observed at [location]. Recommend further evaluation to determine the source prior to close of escrow.",
  },
  {
    system: "Interior",
    cite: "§197-5.12",
    type: "repair",
    text: "Bath and/or kitchen exhaust fan ducting was observed and does not appear to terminate to the building exterior. Recommend further evaluation and correction.",
  },
  {
    system: "Interior",
    cite: "§197-5.12",
    type: "limit",
    text: "Paint, wallpaper, other finish treatments, window treatments, central vacuum systems, household appliances, recreational facilities, and lifts/elevators/dumbwaiters are outside the scope of this inspection per New York State Standards of Practice.",
  },

  // INSULATION & VENTILATION — §197-5.13
  {
    system: "Insulation & Ventilation",
    cite: "§197-5.13",
    type: "info",
    text: "Insulation was observed in accessible, visible unfinished spaces, and ventilation of accessible attic and foundation areas was observed.",
  },
  {
    system: "Insulation & Ventilation",
    cite: "§197-5.13",
    type: "maint",
    text: "Insulation coverage appears uneven or reduced in visible unfinished areas. Recommend evaluation for additional insulation to improve energy efficiency.",
  },
  {
    system: "Insulation & Ventilation",
    cite: "§197-5.13",
    type: "repair",
    text: "Ventilation of the accessible attic and/or foundation area appears insufficient. Recommend further evaluation by a qualified contractor.",
  },
  {
    system: "Insulation & Ventilation",
    cite: "§197-5.13",
    type: "safety",
    text: "Moisture staining or evidence consistent with possible microbial growth was observed in [attic/crawlspace]. Recommend further evaluation by a qualified specialist.",
  },
  {
    system: "Insulation & Ventilation",
    cite: "§197-5.13",
    type: "limit",
    text: "Insulation was not disturbed during this inspection, per New York State Standards of Practice.",
  },

  // FIREPLACES — §197-5.14
  {
    system: "Fireplaces",
    cite: "§197-5.14",
    type: "info",
    text: "Visible and accessible fireplace, chimney, chimney cap, and accessible damper components were observed at time of inspection.",
  },
  {
    system: "Fireplaces",
    cite: "§197-5.14",
    type: "repair",
    text: "Deficiencies were observed at the visible and accessible chimney, chimney cap, or fireplace components. Recommend further evaluation by a qualified chimney specialist.",
  },
  {
    system: "Fireplaces",
    cite: "§197-5.14",
    type: "limit",
    text: "The interior of flues or chimneys, fire screens and doors, automatic fuel feed devices, mantles/surrounds, and draft characteristics are outside the scope of this inspection. Fires were not ignited or extinguished during this inspection, per New York State Standards of Practice.",
  },

  // ATTICS — §197-5.15
  {
    system: "Attics",
    cite: "§197-5.15",
    type: "info",
    text: "The attic space was safely and readily accessible and was observed by [walking the floored area / viewing from the access hatch].",
  },
  {
    system: "Attics",
    cite: "§197-5.15",
    type: "limit",
    text: "The attic was not entered because no walkable floor was present and/or entry would, in the home inspector's judgment, be unsafe, per New York State Standards of Practice. The attic was observed from the access point only.",
  },

  // LIMITATIONS & EXCLUSIONS — §197-5.16 (general boilerplate)
  {
    system: "Limitations & Exclusions",
    cite: "§197-5.16",
    type: "limit",
    text: "This home inspection is not technically exhaustive and is not required to identify concealed conditions, latent defects, or consequential damages, per New York State Standards of Practice.",
  },
  {
    system: "Limitations & Exclusions",
    cite: "§444-b",
    type: "limit",
    text: "This inspection does not include radon or pest inspection, which are excluded from the definition of a home inspection under New York Real Property Law Article 12-B.",
  },
  {
    system: "Limitations & Exclusions",
    cite: "§197-5.16(c)",
    type: "limit",
    text: "This inspection does not address the presence or absence of any suspected hazardous substance, including but not limited to asbestos, lead paint, mold, urea formaldehyde, PCBs, or other environmental hazards, per New York State Standards of Practice.",
  },
  {
    system: "Limitations & Exclusions",
    cite: "§197-5.16(k)",
    type: "limit",
    text: "This report does not determine the cause of any condition or deficiency, the remaining life expectancy of any system or component, or the cost or method of any corrections, per New York State Standards of Practice.",
  },
  {
    system: "Limitations & Exclusions",
    cite: "§197-4.4",
    type: "limit",
    text: "This inspection does not determine property boundary lines, easements, encroachments, compliance with building codes or ordinances, or the market value or marketability of the property.",
  },
  {
    system: "Limitations & Exclusions",
    cite: "§197-5.16(a)",
    type: "limit",
    text: "Items that are concealed, not readily accessible, or would require moving personal property, stored items, or floor/wall coverings to observe are outside the scope of this inspection, per New York State Standards of Practice.",
  },
  {
    system: "Limitations & Exclusions",
    cite: "general",
    type: "limit",
    text: "This report is not a warranty or guarantee of any system or component and is subject to the terms of the signed pre-inspection agreement.",
  },
];

export const INSPECTION_SYSTEMS: string[] = [
  "All systems",
  ...Array.from(new Set(INSPECTION_COMMENTS.map((c) => c.system))),
];
