import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small label above the title — only where the live page has one (data/sections.ts). */
  eyebrow?: string;
  title: React.ReactNode;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  className?: string;
  titleClassName?: string;
  id?: string;
  /** "flyby": the line reveal is driven by the section's PlaneFlyby instead of its own trigger. */
  split?: "auto" | "flyby";
  children?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  tone = "light",
  className,
  titleClassName,
  id,
  split = "auto",
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {eyebrow ? <p className={cn("label", tone === "dark" ? "text-white/70" : "text-muted")}>{eyebrow}</p> : null}
      <Tag
        id={id}
        data-split={split === "flyby" ? "flyby" : ""}
        className={cn(Tag === "h1" ? "h1" : "h2", tone === "dark" ? "text-white" : "text-navy", titleClassName)}
      >
        {title}
      </Tag>
      {children}
    </div>
  );
}
