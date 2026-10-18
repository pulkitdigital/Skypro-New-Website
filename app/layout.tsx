import type { Metadata, Viewport } from "next";
import { B612_Mono, Barlow, Barlow_Condensed } from "next/font/google";
import { site } from "@/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SkipLink } from "@/components/layout/SkipLink";
import { Analytics } from "@/components/layout/Analytics";
import { DemoLecturesProvider } from "@/components/ui/DemoLectures";
import { JsonLd } from "@/components/seo/JsonLd";
import { Preloader } from "@/components/layout/Preloader";
import { MotionLayer } from "@/components/motion/MotionLayer";
import { AltitudeIndicator } from "@/components/fx/AltitudeIndicator";
import { demoIcons, headerIcons, whatsappIcon } from "@/components/layout/layoutIcons";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-barlow",
});

const b612Mono = B612_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-b612-mono",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.seo.title,
  description: site.seo.description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#001F3F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // the inline script below adds `js` / `motion-ok` / `no-preloader` to <html> before hydration
    <html
      lang="en-IN"
      className={`${barlowCondensed.variable} ${barlow.variable} ${b612Mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Motion start states are applied by JS only, so content is visible without JS. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-ok');try{if(sessionStorage.getItem('skypro-preloaded'))d.classList.add('no-preloader');else sessionStorage.setItem('skypro-preloaded','1')}catch(e){d.classList.add('no-preloader')}})(document.documentElement);",
          }}
        />
        <link rel="preload" as="image" href="/media/video/hero-poster-mobile.webp?v=1" media="(max-width: 767.98px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/media/video/hero-poster.webp?v=1" media="(min-width: 768px)" fetchPriority="high" />
        <JsonLd />
      </head>
      <body>
        <Preloader />
        <SkipLink />
        <DemoLecturesProvider icons={demoIcons}>
          <Header icons={headerIcons} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppButton icon={whatsappIcon} />
          <AltitudeIndicator />
        </DemoLecturesProvider>
        <MotionLayer />
        <Analytics />
      </body>
    </html>
  );
}
