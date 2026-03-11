import type { Metadata } from "next";
import { Bebas_Neue, Archivo, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prime Dealer Equity Fund | Automotive Dealership Investment",
    template: "%s | Prime Dealer Equity Fund",
  },
  description:
    "Invest in the $1.2 trillion automotive retail industry. Prime Dealer Equity Fund acquires, optimizes, and scales franchise dealerships across America.",
  keywords: [
    "automotive investment",
    "dealership fund",
    "prime dealer",
    "franchise dealership",
    "alternative investment",
    "Coleman Prime",
  ],
  openGraph: {
    title: "Prime Dealer Equity Fund",
    description:
      "Institutional-quality automotive dealership investment. Recession-resistant. Asset-backed. Revenue-proven.",
    type: "website",
    locale: "en_US",
    siteName: "Prime Dealer Equity Fund",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Dealer Equity Fund",
    description:
      "Institutional-quality automotive dealership investment. Recession-resistant. Asset-backed. Revenue-proven.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${archivo.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zalando+Sans+SemiExpanded:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        {children}

        {/* LinkedIn Insight Tag */}
        <Script id="linkedin-partner" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "8944260";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
        </Script>
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=8944260&fmt=gif"
          />
        </noscript>
      </body>
    </html>
  );
}
