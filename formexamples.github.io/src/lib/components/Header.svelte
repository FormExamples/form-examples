<script lang="ts">
  import { page } from '$app/state';
  import { SITE_NAME, REPO_URL, pageTitle } from '$lib/site';
  import { THEME_OPTIONS, DEFAULT_THEME, THEME_STORAGE_KEY } from '$lib/config/themes';
  import { TEXT_SIZE_OPTIONS, DEFAULT_TEXT_SIZE, TEXT_SIZE_STORAGE_KEY } from '$lib/config/text-sizes';
  import { LOCALE_OPTIONS, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '$lib/config/locales';
  import { SHARE_TARGETS } from '$lib/config/share-targets';
  import PickerBar from '@lilydesignsystem/svelte-picker-bar';

  type Props = { onMenuToggle?: () => void };
  let { onMenuToggle }: Props = $props();

  const themeValues = THEME_OPTIONS.map((t) => t.value);
  const themeLabels = Object.fromEntries(THEME_OPTIONS.map((t) => [t.value, t.label]));
  const textSizeValues = TEXT_SIZE_OPTIONS.map((t) => t.value);
  const textSizeLabels = Object.fromEntries(TEXT_SIZE_OPTIONS.map((t) => [t.value, t.label]));
  const localeValues = LOCALE_OPTIONS.map((l) => l.value);
  const localeLabels = Object.fromEntries(LOCALE_OPTIONS.map((l) => [l.value, l.label]));
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
      <PickerBar
        labels={{
          theme: 'Theme',
          locale: 'Language',
          textSize: 'Text size',
          share: 'Share this page'
        }}
        themesUrl="/themes/"
        themes={themeValues}
        themeProps={{ themeLabels, defaultValue: DEFAULT_THEME, detectFromSystem: true, storageKey: THEME_STORAGE_KEY }}
        locales={localeValues}
        localeProps={{ localeLabels, defaultValue: DEFAULT_LOCALE, storageKey: LOCALE_STORAGE_KEY }}
        sizes={textSizeValues}
        textSizeProps={{ sizeLabels: textSizeLabels, defaultValue: DEFAULT_TEXT_SIZE, storageKey: TEXT_SIZE_STORAGE_KEY }}
        shareTargets={SHARE_TARGETS}
        shareProps={{
          title: pageTitle(page.data.title),
          copyLabel: 'Copy Link',
          copiedLabel: 'Link copied',
          copyFailedLabel: 'Could not copy — copy it from the address bar'
        }}
      />
    </div>
  </div>
</header>
