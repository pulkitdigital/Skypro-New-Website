import { HeroVideo } from "@/components/sections/HeroVideo";
import { HeroIntro } from "@/components/sections/HeroIntro";
import { Highlights } from "@/components/sections/Highlights";
import { Courses } from "@/components/sections/Courses";
import { UpcomingBatch } from "@/components/sections/UpcomingBatch";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Faculty } from "@/components/sections/Faculty";
import { Requirements } from "@/components/sections/Requirements";
import { Pathway } from "@/components/sections/Pathway";
import { Testimonials } from "@/components/sections/Testimonials";
import { AcademyLife } from "@/components/sections/AcademyLife";
import { Enquiry } from "@/components/sections/Enquiry";
import { Faq } from "@/components/sections/Faq";
import { Blogs } from "@/components/sections/Blogs";
import { CounsellingCta } from "@/components/sections/CounsellingCta";
import { TakeOffBand } from "@/components/sections/TakeOffBand";

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <HeroIntro />
      <Highlights />
      <Courses />
      <UpcomingBatch />
      <WhyChoose />
      <Faculty />
      <Requirements />
      <Pathway />
      <Testimonials />
      <AcademyLife />
      <Enquiry />
      <Faq />
      <Blogs />
      <CounsellingCta />
      <TakeOffBand />
    </>
  );
}
