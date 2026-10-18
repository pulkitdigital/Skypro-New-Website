import { Airplane } from "@phosphor-icons/react/dist/ssr/Airplane";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { deferredSection } from "@/lib/sectionSizes";
import { blogs } from "@/data/blogs";
import { headings, labels } from "@/data/sections";
import type { Blog } from "@/data/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NoNavLink } from "@/components/ui/NoNavLink";
import { Img } from "@/components/ui/Img";
import { BlogRoute } from "@/components/fx/BlogRoute";
import { cn } from "@/lib/utils";

/** Route drawn over each article image (from the article subject). */
const ROUTES: Record<string, { from: string; to: string[] }> = {
  "cpl-training-argentina-guide": { from: "India", to: ["Argentina"] },
  "cpl-argentina-vs-south-africa": { from: "India", to: ["Argentina", "South Africa"] },
  "become-pilot-after-12th": { from: "12th", to: ["Cockpit"] },
};
const plane = <Airplane weight="light" className="size-5" />;

function BlogCard({ blog, featured }: { blog: Blog; featured?: boolean }) {
  return (
    <article className={cn("card group flex flex-col gap-5", featured ? "md:col-span-2 lg:col-span-6" : "lg:col-span-3")}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-navy">
        <Img
          image={blog.image}
          fill
          sizes={featured ? "(min-width: 1024px) 620px, 100vw" : "(min-width: 1024px) 300px, (min-width: 768px) 46vw, 100vw"}
          className="zoom-img object-cover"
        />
        {ROUTES[blog.id] ? <BlogRoute from={ROUTES[blog.id]!.from} to={ROUTES[blog.id]!.to} plane={plane} /> : null}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <h3
          className={cn(
            "font-display font-bold text-navy",
            // size before leading: tailwind-merge drops a leading-* that precedes a text-* size
            featured ? "text-[28px] leading-[1.08] md:text-[34px]" : "text-[22px] leading-[1.12]",
          )}
        >
          <span className="hover-underline">{blog.title}</span>
        </h3>
        <p className={cn("text-muted", featured ? "max-w-2xl" : "text-[15px]")}>{blog.excerpt}</p>
        <NoNavLink aria-label={`${labels.readMore} about ${blog.title}`} className="link-arrow self-start pt-2 text-navy">
          {labels.readMore}
          <ArrowRight weight="light" aria-hidden className="size-[18px]" />
        </NoNavLink>
      </div>
    </article>
  );
}

export function Blogs() {
  const cv = deferredSection("blogs");
  const h = headings.blogs;
  const [featured, ...rest] = blogs;
  if (!featured) return null;

  return (
    <section id="blogs" className={`relative bg-mist py-20 md:py-28 ${cv.className}`} style={cv.style}>
      <div className="container-x">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} className="mb-10 max-w-2xl md:mb-14" />
        <div data-stagger className="grid gap-12 md:grid-cols-2 md:gap-x-6 lg:grid-cols-12 lg:gap-x-8">
          <BlogCard blog={featured} featured />
          {rest.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
