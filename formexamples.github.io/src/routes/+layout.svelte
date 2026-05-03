<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let menuOpen = $state(false);
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow dark:focus:bg-slate-900 dark:focus:text-slate-100"
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
