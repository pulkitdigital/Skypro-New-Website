import { AirplaneTakeoff } from "@phosphor-icons/react/dist/ssr/AirplaneTakeoff";
import { SpeakerHigh } from "@phosphor-icons/react/dist/ssr/SpeakerHigh";
import { SpeakerSlash } from "@phosphor-icons/react/dist/ssr/SpeakerSlash";
import { HeroVideoPlayer } from "./HeroVideoPlayer";

/** Server wrapper: the icons render here, so their SVG data stays out of the client bundle. */
export function HeroVideo() {
  return (
    <HeroVideoPlayer
      icons={{
        enquire: <AirplaneTakeoff weight="light" aria-hidden />,
        soundOn: <SpeakerHigh weight="light" aria-hidden className="size-[22px]" />,
        soundOff: <SpeakerSlash weight="light" aria-hidden className="size-[22px]" />,
      }}
    />
  );
}
