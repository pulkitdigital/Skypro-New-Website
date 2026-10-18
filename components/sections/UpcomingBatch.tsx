import { deferredSection } from "@/lib/sectionSizes";
import { batches } from "@/data/batches";
import { headings } from "@/data/sections";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BoardingPass } from "@/components/ui/BoardingPass";

export function UpcomingBatch() {
  const cv = deferredSection("batches");
  const visible = batches.filter((b) => b.visible);
  if (visible.length === 0) return null;
  const h = headings.batches;

  return (
    <section id="batches" className={`relative bg-white py-20 md:py-24 ${cv.className}`} style={cv.style}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-10">
        <SectionHeading title={h.title} className="lg:col-span-3 lg:pt-2" />
        <div className="flex flex-col gap-8 lg:col-span-9">
          {visible.map((batch) => (
            <BoardingPass key={batch.id} batch={batch} />
          ))}
        </div>
      </div>
    </section>
  );
}
