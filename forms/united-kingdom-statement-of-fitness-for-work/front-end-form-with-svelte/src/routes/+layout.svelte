<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Header />
<main class="flex-1">
  <div class="max-w-5xl mx-auto px-4 py-6">
    {@render children()}
  </div>
</main>
<Footer />
