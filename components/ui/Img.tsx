import Image from "next/image";
import type { MediaImage } from "@/data/types";

interface ImgProps {
  image: MediaImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}

/** next/image wrapper: width/height/alt always come from data/, so CLS and alt can't be forgotten. */
export function Img({ image, className, sizes, priority, fill }: ImgProps) {
  if (fill) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        className={className}
      />
    );
  }
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
