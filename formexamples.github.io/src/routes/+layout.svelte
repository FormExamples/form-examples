<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import Header from '$lib/components/Header.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { pageTitle } from '$lib/site';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let menuOpen = $state(false);
</script>

<svelte:head>
  <title>{pageTitle(page.data.title)}</title>
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
