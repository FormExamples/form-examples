<script lang="ts">
  import { page } from '$app/state';
  import { SITE_NAME, REPO_URL, pageTitle } from '$lib/site';
  import { THEME_OPTIONS, DEFAULT_THEME, THEME_STORAGE_KEY } from '$lib/config/themes';
  import { ThemePicker } from 'lily-design-system-svelte-theme-picker';
  import { TextSizePicker } from 'lily-design-system-svelte-text-size-picker';
  import { SharePicker, type ShareTarget } from 'lily-design-system-svelte-share-picker';

  type Props = { onMenuToggle?: () => void };
  let { onMenuToggle }: Props = $props();

  // This site has no i18n content, so there is no LocalePicker (setting
  // lang/dir with nothing translated behind it would be misleading) — see
  // every other header control this site does carry: Theme, Text size, Share.

  const themeValues = THEME_OPTIONS.map((t) => t.value);
  const themeLabels = Object.fromEntries(THEME_OPTIONS.map((t) => [t.value, t.label]));

  // Standard share-intent URLs. Each network gets the current page's title
  // (page.data.title, via pageTitle() — see src/app.d.ts / $lib/site.ts) so
  // the shared text always matches what's in the browser tab.
  const shareTargets: ShareTarget[] = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      id: 'mastodon',
      label: 'Mastodon',
      href: (url, title) =>
        `https://mastodon.social/share?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    {
      id: 'bluesky',
      label: 'Bluesky',
      href: (url, title) =>
        `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    {
      id: 'reddit',
      label: 'Reddit',
      href: (url, title) =>
        `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    }
  ];
</script>

<header class="sticky top-0 z-30 h-14 border-b border-base-300 bg-base-100/90 backdrop-blur">
  <div class="flex h-full items-center justify-between px-4 sm:px-6">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-md p-2 text-base-content hover:bg-base-200 md:hidden"
        aria-label="Toggle navigation"
        onclick={() => onMenuToggle?.()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <a href="/" class="font-semibold text-base-content hover:no-underline">{SITE_NAME}</a>
    </div>
    <div class="flex items-center gap-1">
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-md px-3 py-1.5 text-sm text-base-content hover:bg-base-200 hover:no-underline"
      >
        GitHub
      </a>
      <ThemePicker
        label="Theme"
        themesUrl="/themes/"
        themes={themeValues}
        themeLabels={themeLabels}
        defaultValue={DEFAULT_THEME}
        detectFromSystem
        storageKey={THEME_STORAGE_KEY}
      />
      <TextSizePicker
        label="Text size"
        sizes={['small', 'medium', 'large', 'x-large']}
        defaultValue="medium"
        storageKey="form-examples.text-size.v1"
      />
      <SharePicker
        label="Share this page"
        title={pageTitle(page.data.title)}
        targets={shareTargets}
        copyLabel="Copy link"
        copiedLabel="Link copied"
        copyFailedLabel="Could not copy — copy it from the address bar"
      />
    </div>
  </div>
</header>
