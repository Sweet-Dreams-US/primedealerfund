export interface Dealership {
  name: string;
  slug: string;
  location: string;
  state: string;
  brands: string[];
  status: "operational";
  description: string;
  heroImage: string | null;
  gallery: string[];
  website?: string;
  disclaimer?: string;
  video?: {
    type: "cloudflare";
    id: string;
  };
}

export const dealerships: Dealership[] = [
  {
    name: "Nissan Warsaw",
    slug: "nissan-warsaw",
    location: "Warsaw, IN",
    state: "IN",
    brands: ["Nissan"],
    status: "operational",
    description:
      "A high-performing Nissan franchise in northern Indiana, serving the Warsaw and surrounding communities with new and pre-owned vehicles, parts, and service.",
    website: "https://www.nissanofwarsaw.com/",
    heroImage: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/FrontofStoreNissanWarsaw.webp",
    gallery: [
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/FrontofStoreNissanWarsaw.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawMainSignwithTruck.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanSunSign.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawCarsinShowroom.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawSticker.webp",
    ],
    video: {
      type: "cloudflare",
      id: "700297c313e97262173f0c2107f3b8db",
    },
  },
  {
    name: "Mt. Pleasant Chevy GMC CDJR",
    slug: "mt-pleasant-chevy-gmc-cdjr",
    location: "Mt. Pleasant, IA",
    state: "IA",
    brands: ["Chevrolet", "GMC", "Chrysler", "Dodge", "Jeep", "Ram"],
    status: "operational",
    description:
      "A dominant multi-franchise dealership in southeast Iowa carrying Chevrolet, GMC, and the full CDJR lineup. One of the region's top-performing stores with a broad vehicle mix.",
    website: "https://www.mountpleasantchevygmc.com/",
    heroImage: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/mtpleasantdrone.png",
    gallery: [
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/mtpleasantdrone.png",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasantFront.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/GMCTrucksandSign.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/CDJRsign.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasentGMCSign.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/ChargerOutFront.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasentTruck.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MTPleasentVette.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasentVetterInterrior.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/TraverseoutFront.webp",
    ],
  },
  {
    name: "Le Mars Chevy GMC CDJR",
    slug: "le-mars-chevy-gmc-cdjr",
    location: "Le Mars, IA",
    state: "IA",
    brands: ["Chevrolet", "GMC", "Chrysler", "Dodge", "Jeep", "Ram"],
    status: "operational",
    description:
      "A multi-brand franchise in Le Mars, Iowa — the Ice Cream Capital of the World — offering a full GM and CDJR vehicle selection to northwest Iowa customers.",
    website: "https://www.lemarschevygmc.com/",
    heroImage: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/LEmars/frontofstore.webp",
    gallery: [
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/LEmars/frontofstore.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/LEmars/teamatlemars.webp",
    ],
  },
  {
    name: "Nissan Streetsboro",
    slug: "nissan-streetsboro",
    location: "Streetsboro, OH",
    state: "OH",
    brands: ["Nissan"],
    status: "operational",
    description:
      "A Nissan franchise positioned in northeast Ohio's high-traffic Streetsboro corridor, serving the greater Akron-Cleveland metro area.",
    website: "https://www.nissanstreetsboro.com/",
    heroImage: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Streetsboro/streetsborofrontofstore.webp",
    gallery: [
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Streetsboro/streetsborofrontofstore.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Streetsboro/streetsboroteamphoto.webp",
    ],
  },
  {
    name: "Spirit Lake Ford CDJR",
    slug: "spirit-lake-ford-cdjr",
    location: "Spirit Lake, IA",
    state: "IA",
    brands: ["Ford", "Chrysler", "Dodge", "Jeep", "Ram"],
    status: "operational",
    description:
      "A multi-brand powerhouse in northwest Iowa's lake country, offering Ford and CDJR lineups. Strong community presence with a loyal customer base across the Iowa Great Lakes region.",
    disclaimer:
      "This dealership is owned and operated by Coleman Automotive and not owned by Prime Dealer Equity Fund.",
    website: "https://www.spiritlakefordcdjr.com/",
    heroImage: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/dronespiritlakestorefront.png",
    gallery: [
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/dronespiritlakestorefront.png",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/spiritlakestorefront.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/spiritlakeamericanflags.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/spiritlakefulllotview.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/spiritlakesideview.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/broncospiritlake.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/mustangcolemanspiritlake.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/colemanplatebronco.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/fordsignwateroncars.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/colemancarparts.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/spiritlakedron1.png",
    ],
  },
  {
    name: "Estherville Chevy GMC",
    slug: "estherville-chevy-gmc",
    location: "Estherville, IA",
    state: "IA",
    brands: ["Chevrolet", "GMC"],
    status: "operational",
    description:
      "A Chevrolet and GMC franchise serving the Estherville community and surrounding northwest Iowa market with sales, service, and parts.",
    disclaimer:
      "This dealership is owned and operated by Coleman Automotive and not owned by Prime Dealer Equity Fund.",
    website: "https://www.esthervillechevygmc.com/",
    heroImage: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Estherville/frontofstore.webp",
    gallery: [
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Estherville/frontofstore.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Estherville/esthervillesign.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Estherville/servicebays.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Estherville/serviceoutside.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Estherville/carinside.webp",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Estherville/carinside2.webp",
    ],
  },
];

export function getDealershipBySlug(slug: string): Dealership | undefined {
  return dealerships.find((d) => d.slug === slug);
}

/** Curated set of best photos across all dealerships for the homepage gallery */
export const galleryHighlights = [
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/dronespiritlakestorefront.png",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/mtpleasantdrone.png",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/FrontofStoreNissanWarsaw.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/spiritlakeamericanflags.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasantFront.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawMainSignwithTruck.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/SpirirtLake/broncospiritlake.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MTPleasentVette.webp",
];

export const stateLocations: Record<string, { x: string; y: string }> = {
  IA: { x: "44%", y: "38%" },
  IN: { x: "56%", y: "42%" },
  OH: { x: "62%", y: "40%" },
};
