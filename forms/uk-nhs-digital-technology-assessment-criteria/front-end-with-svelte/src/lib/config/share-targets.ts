import type { ShareTarget } from "@lilydesignsystem/svelte-share-picker";

/**
 * The fleet's standard share destinations. Copy-to-clipboard is handled by
 * SharePicker's own built-in `copyLabel` item, not listed here.
 */
export const SHARE_TARGETS: ShareTarget[] = [
  {
    id: "email",
    label: "Email Link",
    href: (url, title, text) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        text ? `${text}\n\n${url}` : url,
      )}`,
  },
  {
    id: "linkedin",
    label: "Share on LinkedIn",
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    newTab: true,
  },
  {
    id: "reddit",
    label: "Share on Reddit",
    href: (url, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    newTab: true,
  },
  {
    id: "bluesky",
    label: "Share on Bluesky",
    href: (url, title, text) =>
      `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text || title} ${url}`)}`,
    newTab: true,
  },
  {
    id: "mastodon",
    label: "Share on Mastodon",
    href: (url, title, text) =>
      `https://mastodonshare.com/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || title)}`,
    newTab: true,
  },
];
