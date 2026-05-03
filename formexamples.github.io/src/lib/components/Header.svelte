<script lang="ts">
  import { SITE_NAME, REPO_URL } from '$lib/site';
  import DarkModeToggle from './DarkModeToggle.svelte';

  type Props = { onMenuToggle?: () => void };
  let { onMenuToggle }: Props = $props();
</script>

<header class="sticky top-0 z-30 h-14 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
  <div class="flex h-full items-center justify-between px-4 sm:px-6">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="Toggle navigation"
        onclick={() => onMenuToggle?.()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <a href="/" class="font-semibold text-slate-900 hover:no-underline dark:text-slate-100">{SITE_NAME}</a>
    </div>
    <div class="flex items-center gap-1">
      <a
        href={REPO_URL}
        rel="noopener noreferrer"
        class="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:no-underline dark:text-slate-300 dark:hover:bg-slate-800"
      >
        GitHub
      </a>
      <DarkModeToggle />
    </div>
  </div>
</header>
