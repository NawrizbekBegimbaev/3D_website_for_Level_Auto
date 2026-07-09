/** Real LevelAuto contact details. Locale-independent, so they live here
 *  rather than in the dictionaries — only the labels around them are translated. */

export const PHONES = ["+998 90 124 54 55", "+998 50 757 77 27"] as const;

/** `tel:` needs the bare E.164 number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const SOCIALS = [
  { name: "Instagram", handle: "@levelauto_uz", url: "https://instagram.com/levelauto_uz" },
  { name: "YouTube", handle: "@levelauto_uz", url: "https://youtube.com/@levelauto_uz" },
] as const;
