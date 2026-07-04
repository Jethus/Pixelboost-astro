/**
 * Rough read-time from a post body: ~200 wpm, minimum 1 minute.
 * No `readTime` frontmatter field exists — always derive it from `post.body`.
 */
export const readTime = (body: string | undefined): number => {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
