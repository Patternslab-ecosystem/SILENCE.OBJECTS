/** Tiny class-name merger (no external deps). */
export const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");
