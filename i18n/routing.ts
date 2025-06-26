import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["am", "en"],

  // Used when no locale matches
  defaultLocale: "am",
});
