/**
 * Phosphor icons for the client components rendered by the root layout. They are created
 * here, in a server module, and passed down as props, so their SVG data never ships in the
 * client JS bundle. Weight "light" everywhere; "regular" below 16px.
 */
import { AirplaneTakeoff } from "@phosphor-icons/react/dist/ssr/AirplaneTakeoff";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { List } from "@phosphor-icons/react/dist/ssr/List";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { X } from "@phosphor-icons/react/dist/ssr/X";

export const headerIcons = {
  enquire: <AirplaneTakeoff weight="light" aria-hidden />,
  menu: <List weight="light" aria-hidden className="size-6" />,
  close: <X weight="light" aria-hidden className="size-6" />,
  caret: <CaretDown weight="regular" aria-hidden className="size-3.5" />,
  caretLarge: <CaretDown weight="light" aria-hidden className="size-5" />,
  phone: <Phone weight="light" aria-hidden className="size-5" />,
};
export type HeaderIcons = typeof headerIcons;

export const whatsappIcon = <WhatsappLogo weight="light" aria-hidden className="size-7" />;

export const demoIcons = {
  play: <Play weight="fill" aria-hidden className="ml-0.5 size-7" />,
  close: <X weight="light" aria-hidden className="size-5" />,
};
export type DemoIcons = typeof demoIcons;
