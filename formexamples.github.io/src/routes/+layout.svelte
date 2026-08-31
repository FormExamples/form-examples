<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import Header from '$lib/components/Header.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { pageTitle } from '$lib/site';
  import { THEME_OPTIONS } from '$lib/config/themes';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let menuOpen = $state(false);
</script>

<svelte:head>
  <title>{pageTitle(page.data.title)}</title>
  <!-- One <link> per $lib/config/themes.ts entry — the site's multi-stylesheet
       setup. Every theme is always loaded, so ThemePicker's data-theme switch
       (Header.svelte) is pure attribute mutation, never a stylesheet fetch. -->
  {#each THEME_OPTIONS as theme (theme.value)}
    <link rel="stylesheet" href="/themes/{theme.value}.css" />
  {/each}
</svelte:head>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-base-100 focus:px-4 focus:py-2 focus:text-base-content focus:shadow"
>
  Skip to content
</a>

<Header onMenuToggle={() => (menuOpen = !menuOpen)} />

<div class="md:grid md:grid-cols-[15rem_1fr]">
  <Sidebar open={menuOpen} onClose={() => (menuOpen = false)} />
  <main id="main-content" class="min-w-0">
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {@render children()}
    </div>
    <Footer />
  </main>
</div>
