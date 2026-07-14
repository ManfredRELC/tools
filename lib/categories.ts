export type CategoryId =
  | "residential"
  | "manufactured"
  | "commercial"
  | "business"
  | "rental"
  | "auction";

export interface FieldDef {
  key: string;
  label: string;
  hint?: string;
  type: "text" | "number" | "select" | "textarea" | "date";
  options?: string[];
  placeholder?: string;
}

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  // Each inner array is a group of fields rendered side by side (row2/row3).
  rows: FieldDef[][];
  usesTonePicker: boolean;
  fixedToneLabel?: string;
  // Field keys shown as a compact spec summary above the results (in order).
  summaryKeys: string[];
}

export const TONE_OPTIONS = [
  "Luxury",
  "Family-friendly",
  "Investor-focused",
  "Modern & minimal",
  "Cozy & charming",
] as const;

export const MAX_TONES = 3;

export const CATEGORIES: Record<CategoryId, CategoryConfig> = {
  residential: {
    id: "residential",
    label: "Residential",
    usesTonePicker: true,
    summaryKeys: ["beds", "baths", "sqft", "listPrice"],
    rows: [
      [
        {
          key: "address",
          label: "Address or neighborhood",
          hint: "shown to buyer, keep it general if needed",
          type: "text",
          placeholder: "e.g. Whispering Pines, Latham, NY",
        },
      ],
      [
        {
          key: "propertyType",
          label: "Property type",
          type: "select",
          options: [
            "Single-family home",
            "Colonial",
            "Ranch",
            "Condo",
            "Townhouse",
            "Multi-family",
            "Farmhouse / rural",
            "Luxury estate",
          ],
        },
      ],
      [
        { key: "beds", label: "Beds", type: "number", placeholder: "3" },
        { key: "baths", label: "Baths", type: "number", placeholder: "2" },
        { key: "sqft", label: "Sq. ft.", type: "number", placeholder: "1850" },
      ],
      [
        { key: "lotSize", label: "Lot size", type: "text", placeholder: "0.4 acres" },
        { key: "listPrice", label: "List price", type: "text", placeholder: "$449,000" },
      ],
      [
        {
          key: "features",
          label: "Key features",
          hint: "one per line or comma-separated",
          type: "textarea",
          placeholder:
            "Updated kitchen with quartz counters, finished basement, new roof (2023), backs to woods, 2-car garage",
        },
      ],
    ],
  },

  manufactured: {
    id: "manufactured",
    label: "Manufactured / Mobile Home (Leased Land)",
    usesTonePicker: true,
    summaryKeys: ["beds", "baths", "sqft", "listPrice"],
    rows: [
      [
        {
          key: "address",
          label: "Address or neighborhood",
          hint: "shown to buyer, keep it general if needed",
          type: "text",
          placeholder: "e.g. Sunny Acres Community, Clifton Park, NY",
        },
      ],
      [
        { key: "beds", label: "Beds", type: "number", placeholder: "2" },
        { key: "baths", label: "Baths", type: "number", placeholder: "1" },
        { key: "sqft", label: "Sq. ft.", type: "number", placeholder: "980" },
      ],
      [
        { key: "lotSize", label: "Lot / site size", type: "text", placeholder: "0.15 acres" },
        { key: "listPrice", label: "List price", type: "text", placeholder: "$89,000" },
      ],
      [
        {
          key: "groundLease",
          label: "Ground lease / lot rent",
          hint: "monthly amount",
          type: "text",
          placeholder: "$625/month",
        },
      ],
      [
        {
          key: "features",
          label: "Key features",
          hint: "one per line or comma-separated",
          type: "textarea",
          placeholder: "Updated appliances, new skirting, covered carport, shed included",
        },
      ],
    ],
  },

  commercial: {
    id: "commercial",
    label: "Commercial",
    usesTonePicker: true,
    summaryKeys: ["sqft", "leaseType", "listPrice"],
    rows: [
      [
        {
          key: "address",
          label: "Address or area",
          type: "text",
          placeholder: "e.g. Route 9 corridor, Clifton Park, NY",
        },
      ],
      [
        { key: "sqft", label: "Sq. ft.", type: "number", placeholder: "6200" },
        { key: "zoningType", label: "Zoning type", type: "text", placeholder: "C-2 Commercial" },
      ],
      [
        { key: "capRate", label: "Cap rate", type: "text", placeholder: "6.5%" },
        {
          key: "leaseType",
          label: "Lease type",
          type: "select",
          options: ["NNN", "Gross", "Modified gross"],
        },
      ],
      [{ key: "listPrice", label: "List price", type: "text", placeholder: "$1,250,000" }],
      [
        {
          key: "features",
          label: "Key features",
          hint: "one per line or comma-separated",
          type: "textarea",
          placeholder: "High visibility frontage, ample parking, recently renovated, loading dock",
        },
      ],
    ],
  },

  business: {
    id: "business",
    label: "Business Only",
    usesTonePicker: false,
    fixedToneLabel: "Business Listing",
    summaryKeys: ["businessType", "revenue"],
    rows: [
      [
        {
          key: "businessType",
          label: "Business type / industry",
          type: "text",
          placeholder: "e.g. Established pizzeria",
        },
      ],
      [
        {
          key: "revenue",
          label: "Annual revenue or SDE",
          hint: "seller-reported",
          type: "text",
          placeholder: "$410,000 revenue / $115,000 SDE",
        },
      ],
      [{ key: "reasonForSale", label: "Reason for sale", type: "text", placeholder: "Owner retiring" }],
      [
        {
          key: "realEstateIncluded",
          label: "Real estate included",
          type: "select",
          options: ["No — lease only", "Yes", "Optional / negotiable"],
        },
      ],
      [
        {
          key: "features",
          label: "Key features",
          hint: "one per line or comma-separated",
          type: "textarea",
          placeholder: "Turnkey operation, trained staff in place, loyal customer base, equipment included",
        },
      ],
    ],
  },

  rental: {
    id: "rental",
    label: "Rental",
    usesTonePicker: true,
    summaryKeys: ["beds", "baths", "sqft", "monthlyRent"],
    rows: [
      [
        {
          key: "address",
          label: "Address or neighborhood",
          type: "text",
          placeholder: "e.g. Downtown Saratoga Springs, NY",
        },
      ],
      [
        { key: "beds", label: "Beds", type: "number", placeholder: "2" },
        { key: "baths", label: "Baths", type: "number", placeholder: "1" },
        { key: "sqft", label: "Sq. ft.", type: "number", placeholder: "1100" },
      ],
      [
        { key: "monthlyRent", label: "Monthly rent", type: "text", placeholder: "$1,850/month" },
        { key: "leaseTerm", label: "Lease term", type: "text", placeholder: "12 months" },
      ],
      [
        { key: "petPolicy", label: "Pet policy", type: "text", placeholder: "Cats OK, no dogs" },
        {
          key: "utilitiesIncluded",
          label: "Utilities included",
          type: "text",
          placeholder: "Heat and water included",
        },
      ],
      [
        {
          key: "features",
          label: "Key features",
          hint: "one per line or comma-separated",
          type: "textarea",
          placeholder: "In-unit laundry, off-street parking, updated kitchen, walk to downtown",
        },
      ],
    ],
  },

  auction: {
    id: "auction",
    label: "Auction",
    usesTonePicker: false,
    fixedToneLabel: "Auction Listing",
    summaryKeys: ["auctionDate", "minBid"],
    rows: [
      [
        {
          key: "address",
          label: "Address or neighborhood",
          type: "text",
          placeholder: "e.g. Rural parcel, Washington County, NY",
        },
      ],
      [
        {
          key: "propertyType",
          label: "Property type",
          type: "select",
          options: ["Residential", "Commercial", "Land"],
        },
        { key: "auctionDate", label: "Auction date", type: "date" },
      ],
      [
        {
          key: "minBid",
          label: "Minimum bid / reserve",
          hint: "if disclosed",
          type: "text",
          placeholder: "$150,000 reserve",
        },
        { key: "buyersPremium", label: "Buyer's premium", type: "text", placeholder: "10%" },
      ],
      [
        {
          key: "termsOfSale",
          label: "Terms of sale",
          type: "textarea",
          placeholder: "10% deposit day of auction, closing within 30 days, sold as-is",
        },
      ],
      [
        {
          key: "features",
          label: "Key features",
          hint: "one per line or comma-separated",
          type: "textarea",
          placeholder: "3 bed farmhouse, 12 acres, barn and outbuildings, road frontage",
        },
      ],
    ],
  },
};

export const CATEGORY_LIST: CategoryConfig[] = Object.values(CATEGORIES);
