"use client";

import * as React from "react";
import { demoLectures } from "@/data/faculty";
import { labels } from "@/data/sections";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YouTubeFacade } from "@/components/ui/YouTubeFacade";
import { buttonVariants } from "@/components/ui/buttonVariants";
import type { DemoIcons } from "@/components/layout/layoutIcons";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

interface DemoContextValue {
  openDemo: (facultyId?: string) => void;
}

const DemoContext = React.createContext<DemoContextValue>({ openDemo: () => {} });

/** One global "Watch Demo Lectures" dialog (PRD OQ-4 default): in-page, click-to-load YouTube. */
export function DemoLecturesProvider({ children, icons }: { children: React.ReactNode; icons: DemoIcons }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(demoLectures[0]?.facultyId ?? "");

  const openDemo = React.useCallback((facultyId?: string) => {
    if (facultyId && demoLectures.some((d) => d.facultyId === facultyId)) setActive(facultyId);
    setOpen(true);
    getLenis()?.stop();
  }, []);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) getLenis()?.start();
  };

  return (
    <DemoContext.Provider value={{ openDemo }}>
      {children}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent tone="dark" closeIcon={icons.close} className="gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-2 pr-12">
            <DialogTitle className="text-white">{labels.watchDemoLectures}</DialogTitle>
            <DialogDescription className="text-white/70">
              {demoLectures.map((d) => d.title).join(" · ")}
            </DialogDescription>
          </div>
          <Tabs value={active} onValueChange={setActive} className="flex flex-col gap-5">
            <TabsList aria-label="Demo lectures" className="gap-6 border-b border-white/10">
              {demoLectures.map((lecture) => (
                <TabsTrigger key={lecture.id} value={lecture.facultyId}>
                  {lecture.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {demoLectures.map((lecture) => (
              <TabsContent key={lecture.id} value={lecture.facultyId} className="outline-none">
                <YouTubeFacade
                  id={lecture.youtubeId}
                  title={`${labels.watchDemoLectures} — ${lecture.title}`}
                  playIcon={icons.play}
                />
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </DemoContext.Provider>
  );
}

export function useDemoLectures() {
  return React.useContext(DemoContext);
}

/**
 * Opens the demo dialog. Default look is the secondary text link (pass the arrow icon as a
 * child from a server component); `amber`/`navy` render a button.
 */
export function WatchDemoButton({
  facultyId,
  children = labels.watchDemoLectures,
  className,
  appearance = "link",
}: {
  facultyId?: string;
  children?: React.ReactNode;
  className?: string;
  /** "none": no preset look — the caller's className styles it. */
  appearance?: "link" | "amber" | "navy" | "none";
}) {
  const { openDemo } = useDemoLectures();
  return (
    <button
      type="button"
      data-cursor="play"
      onClick={() => openDemo(facultyId)}
      className={cn(
        appearance === "link" ? "link-arrow" : appearance === "none" ? "cursor-pointer" : buttonVariants({ variant: appearance }),
        className,
      )}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}
