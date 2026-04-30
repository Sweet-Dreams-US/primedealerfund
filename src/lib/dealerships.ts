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
  pressRelease?: {
    slug: string;
    title: string;
    date: string;
  };
}

export const dealerships: Dealership[] = [
  {
    name: "Nissan of Elgin",
    slug: "nissan-elgin",
    location: "Elgin, IL",
    state: "IL",
    brands: ["Nissan"],
    status: "operational",
    description:
      "Coleman Prime's first dealership in the Chicago metropolitan market and the partnership's third Nissan rooftop. Acquired May 2026 from McGrath Nissan of Elgin, the store anchors the group's expansion into greater Chicago.",
    pressRelease: {
      slug: "nissan-of-elgin-acquisition-press-release",
      title:
        "Coleman Prime Acquires Nissan of Elgin, Reaching Five Dealerships in One Year and Expanding Into the Chicago Metro",
      date: "May 1, 2026",
    },
    heroImage: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/FrontofNissanElgin.jpg",
    gallery: [
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/FrontofNissanElgin.jpg",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/ColemanPrimeTeamInFrontofNewStore.jpg",
      "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/ServiceDepartment.jpg",
    ],
  },
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
];

export function getDealershipBySlug(slug: string): Dealership | undefined {
  return dealerships.find((d) => d.slug === slug);
}

/** Curated set of best photos across all dealerships for the homepage gallery */
export const galleryHighlights = [
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/mtpleasantdrone.png",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/FrontofNissanElgin.jpg",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/FrontofStoreNissanWarsaw.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/ColemanPrimeTeamInFrontofNewStore.jpg",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasantFront.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawMainSignwithTruck.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/ChargerOutFront.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MTPleasentVette.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Streetsboro/streetsborofrontofstore.webp",
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/LEmars/frontofstore.webp",
];

export const stateLocations: Record<string, { x: string; y: string }> = {
  IA: { x: "44%", y: "38%" },
  IL: { x: "51%", y: "41%" },
  IN: { x: "56%", y: "42%" },
  OH: { x: "62%", y: "40%" },
};
