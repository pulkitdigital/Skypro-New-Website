import Link from "next/link";
import { AirplaneLanding } from "@phosphor-icons/react/dist/ssr/AirplaneLanding";

export default function NotFound() {
  return (
    <section className="tone-dark flex min-h-[80svh] items-center bg-navy-deep pt-32 pb-20 text-white">
      <div className="container-x flex flex-col items-start gap-6">
        <p className="label text-amber">404</p>
        <h1 className="h1">Page not found</h1>
        <Link href="/" className="link-arrow text-white">
          <AirplaneLanding weight="light" aria-hidden className="size-5" />
          SkyPro Aviation
        </Link>
      </div>
    </section>
  );
}
