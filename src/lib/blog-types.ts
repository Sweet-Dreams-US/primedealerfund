export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption: string;
      orientation?: "wide" | "portrait";
    }
  | {
      type: "callout-numbers";
      title: string;
      lines: string[];
      link?: { text: string; href: string };
    }
  | {
      type: "callout-prime";
      lines: string[];
      link?: { text: string; href: string };
    }
  | {
      type: "callout-floor";
      quote: string;
      attribution: string;
      stats?: string[];
      link?: { text: string; href: string };
      attributionPrefix?: string;
    };

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  heroImage: {
    src: string;
    alt: string;
    caption: string;
  };
  excerpt: string;
  content: ContentBlock[];
  relatedSlugs: string[];
}
